#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const os = require("os");
const tls = require("tls");
const { execSync } = require("child_process");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const DEFAULT_TIMEOUT_MS = Number(process.env.HEALTHCHECK_TIMEOUT_MS || 10000);
const STORE_URL = process.env.HEALTHCHECK_STORE_URL || "http://127.0.0.1:3000/";
const API_URL =
  process.env.HEALTHCHECK_API_URL || "http://127.0.0.1:5055/v1/setting/global";
const API_BASE_URL =
  process.env.HEALTHCHECK_API_BASE_URL ||
  API_URL.replace(/\/v1\/setting\/global\/?$/, "");
const EMAIL_FROM = process.env.HEALTHCHECK_EMAIL_FROM || process.env.EMAIL_USER;

const reportDir = path.resolve(__dirname, "../../deploy/reports");
const latestStatusPath = path.join(reportDir, "healthcheck-latest.json");

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const parseRecipientList = (value) => {
  return String(value || "")
    .split(/[;,]/)
    .map((item) => item.trim())
    .filter(Boolean)
    .join(", ");
};

const parseUrlList = (value) => {
  return String(value || "")
    .split(/[,;\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
};

const normalizeWebsiteToUrl = (website = "") => {
  const value = String(website || "").trim();
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  return `https://${value}`;
};

const normalizeApiPath = (input = "") => {
  const raw = String(input || "").trim();
  if (!raw) return "/v1/coupon/show";
  return raw.startsWith("/") ? raw : `/${raw}`;
};

const safeNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const getThresholds = (globalSettingData) => {
  return {
    sslDays: safeNumber(
      process.env.HEALTHCHECK_SSL_EXPIRY_THRESHOLD_DAYS ||
        globalSettingData?.healthcheck_ssl_expiry_threshold_days,
      20
    ),
    cpuPercent: safeNumber(
      process.env.HEALTHCHECK_CPU_THRESHOLD_PERCENT ||
        globalSettingData?.healthcheck_cpu_threshold_percent,
      85
    ),
    ramPercent: safeNumber(
      process.env.HEALTHCHECK_RAM_THRESHOLD_PERCENT ||
        globalSettingData?.healthcheck_ram_threshold_percent,
      85
    ),
    diskPercent: safeNumber(
      process.env.HEALTHCHECK_DISK_THRESHOLD_PERCENT ||
        globalSettingData?.healthcheck_disk_threshold_percent,
      90
    ),
  };
};

const getCpuTimes = () => {
  return os.cpus().map((cpu) => {
    const times = cpu.times || {};
    const idle = times.idle || 0;
    const total = Object.values(times).reduce((sum, t) => sum + t, 0);
    return { idle, total };
  });
};

const getCpuUsagePercent = async (sampleMs = 300) => {
  const start = getCpuTimes();
  await sleep(sampleMs);
  const end = getCpuTimes();

  let idleDiff = 0;
  let totalDiff = 0;

  for (let i = 0; i < Math.min(start.length, end.length); i += 1) {
    idleDiff += Math.max(0, end[i].idle - start[i].idle);
    totalDiff += Math.max(0, end[i].total - start[i].total);
  }

  if (!totalDiff) return 0;
  return (1 - idleDiff / totalDiff) * 100;
};

const getRootDiskUsagePercent = () => {
  const out = execSync("df -Pk /", {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"],
  });

  const lines = String(out || "")
    .trim()
    .split("\n");
  const target = lines[lines.length - 1] || "";
  const cols = target.trim().split(/\s+/);
  const useCol = cols[4] || "0%";
  return Number(String(useCol).replace("%", "")) || 0;
};

const checkServerResources = async (thresholds) => {
  const checks = [];

  const cpuStart = Date.now();
  try {
    const cpu = await getCpuUsagePercent(350);
    checks.push({
      name: "Server CPU usage",
      url: "local://server/cpu",
      ok: cpu <= thresholds.cpuPercent,
      status: cpu <= thresholds.cpuPercent ? 200 : 429,
      elapsedMs: Date.now() - cpuStart,
      bodyPreview: `cpu_usage=${cpu.toFixed(2)}% threshold=${thresholds.cpuPercent}%`,
      error:
        cpu <= thresholds.cpuPercent
          ? null
          : `CPU usage above threshold (${cpu.toFixed(2)}%)`,
    });
  } catch (error) {
    checks.push({
      name: "Server CPU usage",
      url: "local://server/cpu",
      ok: false,
      status: 0,
      elapsedMs: Date.now() - cpuStart,
      bodyPreview: "",
      error: error?.message || "CPU usage check failed",
    });
  }

  const ramStart = Date.now();
  try {
    const total = os.totalmem();
    const free = os.freemem();
    const usedPercent = total ? ((total - free) / total) * 100 : 0;
    checks.push({
      name: "Server RAM usage",
      url: "local://server/ram",
      ok: usedPercent <= thresholds.ramPercent,
      status: usedPercent <= thresholds.ramPercent ? 200 : 429,
      elapsedMs: Date.now() - ramStart,
      bodyPreview: `ram_usage=${usedPercent.toFixed(2)}% threshold=${thresholds.ramPercent}%`,
      error:
        usedPercent <= thresholds.ramPercent
          ? null
          : `RAM usage above threshold (${usedPercent.toFixed(2)}%)`,
    });
  } catch (error) {
    checks.push({
      name: "Server RAM usage",
      url: "local://server/ram",
      ok: false,
      status: 0,
      elapsedMs: Date.now() - ramStart,
      bodyPreview: "",
      error: error?.message || "RAM usage check failed",
    });
  }

  const diskStart = Date.now();
  try {
    const diskPercent = getRootDiskUsagePercent();
    checks.push({
      name: "Server disk usage",
      url: "local://server/disk",
      ok: diskPercent <= thresholds.diskPercent,
      status: diskPercent <= thresholds.diskPercent ? 200 : 429,
      elapsedMs: Date.now() - diskStart,
      bodyPreview: `disk_usage=${diskPercent}% threshold=${thresholds.diskPercent}%`,
      error:
        diskPercent <= thresholds.diskPercent
          ? null
          : `Disk usage above threshold (${diskPercent}%)`,
    });
  } catch (error) {
    checks.push({
      name: "Server disk usage",
      url: "local://server/disk",
      ok: false,
      status: 0,
      elapsedMs: Date.now() - diskStart,
      bodyPreview: "",
      error: error?.message || "Disk usage check failed",
    });
  }

  return checks;
};

const checkSslExpiry = async (publicUrl, thresholdDays, timeoutMs) => {
  const startedAt = Date.now();

  let parsedUrl;
  try {
    parsedUrl = new URL(publicUrl);
  } catch {
    return {
      name: "SSL expiry check",
      url: publicUrl,
      ok: false,
      status: 0,
      elapsedMs: Date.now() - startedAt,
      bodyPreview: "",
      error: "Invalid URL",
    };
  }

  if (parsedUrl.protocol !== "https:") {
    return {
      name: "SSL expiry check",
      url: publicUrl,
      ok: false,
      status: 0,
      elapsedMs: Date.now() - startedAt,
      bodyPreview: "",
      error: "SSL check requires https URL",
    };
  }

  const host = parsedUrl.hostname;
  const port = Number(parsedUrl.port || 443);

  return new Promise((resolve) => {
    const socket = tls.connect(
      {
        host,
        port,
        servername: host,
        rejectUnauthorized: true,
      },
      () => {
        try {
          const cert = socket.getPeerCertificate();
          const validTo = cert?.valid_to ? new Date(cert.valid_to) : null;

          if (!validTo || Number.isNaN(validTo.getTime())) {
            resolve({
              name: "SSL expiry check",
              url: publicUrl,
              ok: false,
              status: 0,
              elapsedMs: Date.now() - startedAt,
              bodyPreview: "",
              error: "Could not read certificate expiry",
            });
            socket.end();
            return;
          }

          const daysLeft = Math.floor(
            (validTo.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
          );

          resolve({
            name: "SSL expiry check",
            url: publicUrl,
            ok: daysLeft >= thresholdDays,
            status: daysLeft >= thresholdDays ? 200 : 428,
            elapsedMs: Date.now() - startedAt,
            bodyPreview: `ssl_days_left=${daysLeft} threshold_days=${thresholdDays} expires=${validTo.toISOString()}`,
            error:
              daysLeft >= thresholdDays
                ? null
                : `SSL expires soon (${daysLeft} days left)`,
          });
          socket.end();
        } catch (error) {
          resolve({
            name: "SSL expiry check",
            url: publicUrl,
            ok: false,
            status: 0,
            elapsedMs: Date.now() - startedAt,
            bodyPreview: "",
            error: error?.message || "SSL check failed",
          });
          socket.end();
        }
      }
    );

    socket.setTimeout(timeoutMs, () => {
      resolve({
        name: "SSL expiry check",
        url: publicUrl,
        ok: false,
        status: 0,
        elapsedMs: Date.now() - startedAt,
        bodyPreview: "",
        error: "SSL check timeout",
      });
      socket.destroy();
    });

    socket.on("error", (error) => {
      resolve({
        name: "SSL expiry check",
        url: publicUrl,
        ok: false,
        status: 0,
        elapsedMs: Date.now() - startedAt,
        bodyPreview: "",
        error: error?.message || "TLS error",
      });
    });
  });
};

const resolveApiUrl = (base, pathName) => {
  const safeBase = String(base || "").replace(/\/+$/, "");
  const safePath = normalizeApiPath(pathName);
  return `${safeBase}${safePath}`;
};

const validateCheckoutSanityResponse = (status, bodyText) => {
  if (status < 200 || status >= 300) return false;

  try {
    const parsed = JSON.parse(bodyText || "[]");
    return Array.isArray(parsed) || (parsed && typeof parsed === "object");
  } catch {
    return false;
  }
};

const getGlobalSettingData = async () => {
  try {
    const res = await fetch(API_URL, {
      method: "GET",
      headers: {
        "user-agent": "Babys-Healthcheck/1.0",
      },
    });

    if (!res.ok) {
      return null;
    }

    return await res.json();
  } catch {
    return null;
  }
};

const resolveDynamicEmailTo = async () => {
  const fromEnv = parseRecipientList(process.env.HEALTHCHECK_EMAIL_TO);
  if (fromEnv) return fromEnv;

  const globalSettingData = await getGlobalSettingData();

  if (globalSettingData) {
    const dynamicFromApi = parseRecipientList(
      globalSettingData?.healthcheck_email_to ||
        globalSettingData?.email ||
        globalSettingData?.from_email
    );
    if (dynamicFromApi) return dynamicFromApi;
  }

  return parseRecipientList(process.env.EMAIL_USER);
};

const withTimeout = async (url, timeoutMs, options = {}) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const startedAt = Date.now();
  const method = options.method || "GET";

  try {
    const response = await fetch(url, {
      method,
      signal: controller.signal,
      headers: {
        "user-agent": "Babys-Healthcheck/1.0",
      },
    });

    const elapsedMs = Date.now() - startedAt;
    const body = await response.text();

    const customValidator =
      typeof options.validate === "function" ? options.validate : null;
    const ok = customValidator
      ? customValidator(response.status, body)
      : response.ok;

    return {
      name: options.name || url,
      url,
      ok,
      status: response.status,
      elapsedMs,
      bodyPreview: (body || "").slice(0, 180).replace(/\n/g, " "),
      error: null,
    };
  } catch (error) {
    return {
      name: options.name || url,
      url,
      ok: false,
      status: 0,
      elapsedMs: Date.now() - startedAt,
      bodyPreview: "",
      error: error?.message || "Unknown fetch error",
    };
  } finally {
    clearTimeout(timer);
  }
};

const checkMongoConnection = async (timeoutMs) => {
  const startedAt = Date.now();

  if (!process.env.MONGO_URI) {
    return {
      name: "MongoDB ping",
      url: "mongodb://***",
      ok: false,
      status: 0,
      elapsedMs: 0,
      bodyPreview: "",
      error: "MONGO_URI is not configured",
    };
  }

  let connection;
  try {
    connection = await mongoose.createConnection(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: timeoutMs,
      maxPoolSize: 1,
    }).asPromise();

    await connection.db.admin().ping();

    return {
      name: "MongoDB ping",
      url: "mongodb://***",
      ok: true,
      status: 200,
      elapsedMs: Date.now() - startedAt,
      bodyPreview: "MongoDB ping success",
      error: null,
    };
  } catch (error) {
    return {
      name: "MongoDB ping",
      url: "mongodb://***",
      ok: false,
      status: 0,
      elapsedMs: Date.now() - startedAt,
      bodyPreview: "",
      error: error?.message || "MongoDB ping failed",
    };
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch {
        // Ignore close error.
      }
    }
  }
};

const escapeHtml = (value) => {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
};

const toTitleCase = (value) => {
  return String(value || "")
    .toLowerCase()
    .replace(/(^|\s)\S/g, (c) => c.toUpperCase());
};

const getSeverity = (check) => {
  const name = String(check?.name || "").toLowerCase();
  if (check?.ok) return "passed";

  if (
    name.includes("mongodb") ||
    name.includes("storefront") ||
    name.includes("api global")
  ) {
    return "high";
  }

  if (name.includes("ssl") || name.includes("checkout") || name.includes("public")) {
    return "medium";
  }

  return "low";
};

const getRecommendation = (check) => {
  const name = String(check?.name || "").toLowerCase();

  if (name.includes("storefront")) {
    return "Verify Next.js process, domain routing, and reverse proxy health for storefront traffic.";
  }

  if (name.includes("api global")) {
    return "Verify backend process status, API routing, and middleware configuration for core endpoints.";
  }

  if (name.includes("mongodb")) {
    return "Check MongoDB availability, credentials, network ACL rules, and connection pool limits.";
  }

  if (name.includes("checkout")) {
    return "Validate coupon/checkout service dependencies and ensure response schema remains stable.";
  }

  if (name.includes("ssl")) {
    return "Renew certificate and validate full chain on the public domain before threshold breach.";
  }

  if (name.includes("cpu")) {
    return "Scale compute resources or optimize long-running workloads and background jobs.";
  }

  if (name.includes("ram")) {
    return "Review memory hotspots, PM2 restart strategy, and Node.js heap usage trends.";
  }

  if (name.includes("disk")) {
    return "Clean logs/artifacts, rotate backups, and increase storage before service degradation.";
  }

  if (name.includes("public domain")) {
    return "Check DNS, TLS termination, firewall rules, and upstream proxy for public availability.";
  }

  return "Investigate endpoint dependencies and verify configuration, networking, and service runtime state.";
};

const getProtectionLevel = (score) => {
  if (score >= 90) return "Very High";
  if (score >= 75) return "High";
  if (score >= 60) return "Medium";
  if (score >= 40) return "Low";
  return "Critical";
};

const formatDateTime = (dateLike) => {
  const d = new Date(dateLike);
  if (Number.isNaN(d.getTime())) return String(dateLike || "N/A");
  return d.toLocaleString();
};

const buildDashboardModel = ({ summary, generatedAt, checks, thresholds }) => {
  const total = checks.length;
  const passed = checks.filter((item) => item.ok).length;
  const failed = total - passed;
  const score = total ? Math.round((passed / total) * 100) : 0;
  const avgLatency = total
    ? Math.round(
        checks.reduce((sum, item) => sum + Number(item.elapsedMs || 0), 0) / total
      )
    : 0;

  const findings = checks
    .filter((item) => !item.ok)
    .map((item) => ({
      ...item,
      severity: getSeverity(item),
      recommendation: getRecommendation(item),
      observed: item.error || item.bodyPreview || `HTTP ${item.status}`,
    }));

  const improvingActions = findings.slice(0, 8);

  return {
    summary,
    generatedAt,
    checks,
    thresholds,
    total,
    passed,
    failed,
    score,
    avgLatency,
    protectionLevel: getProtectionLevel(score),
    findings,
    improvingActions,
  };
};

const buildHtmlReport = (model) => {
  const {
    summary,
    generatedAt,
    total,
    passed,
    failed,
    score,
    avgLatency,
    protectionLevel,
    findings,
    improvingActions,
    thresholds,
    checks,
  } = model;

  const scoreColor = summary === "PASS" ? "#16a34a" : "#dc2626";

  const findingsRows = findings.length
    ? findings
        .map(
          (item) => `
        <tr>
          <td><span class="sev sev-${escapeHtml(item.severity)}">${escapeHtml(
            toTitleCase(item.severity)
          )}</span></td>
          <td>${escapeHtml(item.name)}</td>
          <td>${escapeHtml(item.observed)}</td>
          <td>${escapeHtml(item.recommendation)}</td>
        </tr>`
        )
        .join("")
    : `<tr><td colspan="4" class="ok-row">No active failures. All checks passed.</td></tr>`;

  const actionRows = improvingActions.length
    ? improvingActions
        .map((item) => {
          const actionScore = item.severity === "high" ? 22 : item.severity === "medium" ? 12 : 8;
          return `
        <div class="action-item">
          <div class="action-top">
            <span>${escapeHtml(item.name)}</span>
            <span>+${actionScore}</span>
          </div>
          <div class="progress-wrap"><div class="progress" style="width:${Math.min(
            100,
            actionScore * 3
          )}%"></div></div>
          <p>${escapeHtml(item.recommendation)}</p>
        </div>`;
        })
        .join("")
    : `<p class="ok-row">No improvement actions required. Keep monitoring daily.</p>`;

  const checkRows = checks
    .map(
      (item) => `
    <tr>
      <td>${escapeHtml(item.ok ? "PASS" : "FAIL")}</td>
      <td>${escapeHtml(item.name)}</td>
      <td>${escapeHtml(String(item.status))}</td>
      <td>${escapeHtml(String(item.elapsedMs))} ms</td>
      <td>${escapeHtml(item.error || item.bodyPreview || "-")}</td>
    </tr>`
    )
    .join("");

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Babys Security Health Check Report</title>
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; background:#f5f6f8; color:#1f2937; margin:0; padding:24px; }
    .wrap { max-width: 1200px; margin: 0 auto; }
    .header { display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:14px; }
    .title { font-size:40px; font-weight:800; letter-spacing:1px; color:#f59e0b; margin:0; }
    .sub { margin:4px 0 0; color:#6b7280; font-size:14px; }
    .status-pill { background:${scoreColor}; color:#fff; border-radius:999px; padding:10px 16px; font-weight:700; }
    .grid { display:grid; grid-template-columns: 1fr 1fr; gap:16px; }
    .card { background:#fff; border:1px solid #e5e7eb; border-radius:10px; box-shadow:0 1px 2px rgba(0,0,0,.05); }
    .card h3 { margin:0; padding:12px 14px; border-bottom:1px solid #e5e7eb; font-size:20px; }
    .body { padding:14px; }
    .score-grid { display:grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap:10px; }
    .kpi { background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:12px; }
    .kpi .k { color:#64748b; font-size:12px; text-transform:uppercase; letter-spacing:.06em; }
    .kpi .v { font-size:28px; font-weight:800; margin-top:4px; }
    .actions { display:flex; flex-direction:column; gap:10px; }
    .action-item { border:1px solid #e5e7eb; border-radius:8px; padding:10px; background:#fff; }
    .action-top { display:flex; justify-content:space-between; font-weight:700; margin-bottom:6px; }
    .progress-wrap { height:10px; background:#e5e7eb; border-radius:999px; overflow:hidden; margin-bottom:8px; }
    .progress { height:100%; background:#84cc16; }
    table { width:100%; border-collapse:collapse; }
    th, td { border:1px solid #e5e7eb; padding:8px; text-align:left; vertical-align:top; font-size:13px; }
    th { background:#f8fafc; }
    .sev { display:inline-block; padding:4px 8px; border-radius:999px; color:#fff; font-size:12px; font-weight:700; }
    .sev-high { background:#dc2626; }
    .sev-medium { background:#f59e0b; }
    .sev-low { background:#3b82f6; }
    .sev-passed { background:#16a34a; }
    .meta { margin-top:14px; font-size:12px; color:#6b7280; }
    .ok-row { text-align:center; color:#166534; font-weight:700; padding:14px; }
    .foot { margin-top:16px; font-size:12px; color:#6b7280; }
    @media (max-width: 900px) { .grid { grid-template-columns: 1fr; } .title { font-size:28px; } }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="header">
      <div>
        <h1 class="title">SECURITY HEALTH CHECK REPORT</h1>
        <p class="sub">Generated: ${escapeHtml(formatDateTime(generatedAt))}</p>
      </div>
      <div class="status-pill">${escapeHtml(summary)}</div>
    </div>

    <div class="grid">
      <section class="card">
        <h3>How You Scored</h3>
        <div class="body">
          <div class="score-grid">
            <div class="kpi"><div class="k">Health Score</div><div class="v" style="color:${scoreColor}">${score}</div></div>
            <div class="kpi"><div class="k">Protection Level</div><div class="v">${escapeHtml(protectionLevel)}</div></div>
            <div class="kpi"><div class="k">Total Checks</div><div class="v">${total}</div></div>
            <div class="kpi"><div class="k">Passed / Failed</div><div class="v">${passed} / ${failed}</div></div>
            <div class="kpi"><div class="k">Avg Latency</div><div class="v">${avgLatency}ms</div></div>
            <div class="kpi"><div class="k">Thresholds</div><div class="v" style="font-size:14px;line-height:1.5">SSL ${escapeHtml(
              String(thresholds.sslDays)
            )}d, CPU ${escapeHtml(String(thresholds.cpuPercent))}%, RAM ${escapeHtml(
              String(thresholds.ramPercent)
            )}%, Disk ${escapeHtml(String(thresholds.diskPercent))}%</div></div>
          </div>
        </div>
      </section>

      <section class="card">
        <h3>Improving Your Score</h3>
        <div class="body actions">
          ${actionRows}
        </div>
      </section>
    </div>

    <section class="card" style="margin-top:16px;">
      <h3>Report Findings</h3>
      <div class="body">
        <table>
          <thead>
            <tr>
              <th style="width:120px">Severity</th>
              <th style="width:240px">We Found</th>
              <th>Observed</th>
              <th>We Recommend</th>
            </tr>
          </thead>
          <tbody>
            ${findingsRows}
          </tbody>
        </table>
      </div>
    </section>

    <section class="card" style="margin-top:16px;">
      <h3>All Check Results</h3>
      <div class="body">
        <table>
          <thead>
            <tr>
              <th style="width:100px">Result</th>
              <th style="width:260px">Check</th>
              <th style="width:90px">Status</th>
              <th style="width:120px">Latency</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            ${checkRows}
          </tbody>
        </table>
      </div>
    </section>

    <p class="foot">This report is auto-generated by Babys daily monitoring. Keep thresholds tuned based on production load and risk profile.</p>
  </div>
</body>
</html>`;
};

const buildEmailHtml = (model) => {
  const { summary, score, protectionLevel, passed, failed, total, findings, generatedAt } =
    model;
  const topFindings = findings.slice(0, 6);
  const summaryColor = summary === "PASS" ? "#16a34a" : "#dc2626";

  const findingsHtml = topFindings.length
    ? topFindings
        .map(
          (f) => `
      <tr>
        <td style="padding:8px;border:1px solid #e5e7eb;">${escapeHtml(
          toTitleCase(f.severity)
        )}</td>
        <td style="padding:8px;border:1px solid #e5e7eb;">${escapeHtml(f.name)}</td>
        <td style="padding:8px;border:1px solid #e5e7eb;">${escapeHtml(
          f.observed
        )}</td>
      </tr>`
        )
        .join("")
    : `<tr><td colspan="3" style="padding:10px;border:1px solid #e5e7eb;color:#166534;font-weight:700;">No failures found.</td></tr>`;

  return `
  <div style="font-family:Segoe UI,Arial,sans-serif;background:#f5f6f8;padding:20px;">
    <div style="max-width:900px;margin:0 auto;background:#fff;border:1px solid #e5e7eb;border-radius:10px;overflow:hidden;">
      <div style="padding:16px 20px;background:#111827;color:#fff;display:flex;justify-content:space-between;align-items:center;">
        <div>
          <h2 style="margin:0;color:#f59e0b;letter-spacing:.04em;">SECURITY HEALTH CHECK REPORT</h2>
          <p style="margin:6px 0 0;color:#d1d5db;font-size:13px;">Generated: ${escapeHtml(
            formatDateTime(generatedAt)
          )}</p>
        </div>
        <span style="background:${summaryColor};padding:8px 12px;border-radius:999px;font-weight:700;">${escapeHtml(
          summary
        )}</span>
      </div>
      <div style="padding:16px 20px;">
        <table style="width:100%;border-collapse:collapse;margin-bottom:16px;">
          <tr>
            <td style="padding:10px;border:1px solid #e5e7eb;"><strong>Health Score:</strong> ${score}</td>
            <td style="padding:10px;border:1px solid #e5e7eb;"><strong>Protection:</strong> ${escapeHtml(
              protectionLevel
            )}</td>
            <td style="padding:10px;border:1px solid #e5e7eb;"><strong>Checks:</strong> ${passed}/${total} passed</td>
            <td style="padding:10px;border:1px solid #e5e7eb;"><strong>Failures:</strong> ${failed}</td>
          </tr>
        </table>

        <h3 style="margin:0 0 10px;">Top Findings</h3>
        <table style="width:100%;border-collapse:collapse;">
          <thead>
            <tr>
              <th style="text-align:left;padding:8px;border:1px solid #e5e7eb;background:#f8fafc;">Severity</th>
              <th style="text-align:left;padding:8px;border:1px solid #e5e7eb;background:#f8fafc;">Issue</th>
              <th style="text-align:left;padding:8px;border:1px solid #e5e7eb;background:#f8fafc;">Observed</th>
            </tr>
          </thead>
          <tbody>
            ${findingsHtml}
          </tbody>
        </table>

        <p style="margin:14px 0 0;color:#6b7280;font-size:13px;">Detailed dashboard report is attached as HTML.</p>
      </div>
    </div>
  </div>`;
};

const toLine = (result) => {
  const statusLabel = result.ok ? "PASS" : "FAIL";
  const details = result.error
    ? `error=${result.error}`
    : `status=${result.status} preview=\"${result.bodyPreview}\"`;

  return `${statusLabel} check=${result.name} url=${result.url} latency_ms=${result.elapsedMs} ${details}`;
};

const buildReport = (results) => {
  const now = new Date();
  const allPass = results.every((item) => item.ok);
  const summary = allPass ? "PASS" : "FAIL";

  const lines = [
    `Babys Daily Health Report`,
    `GeneratedAt=${now.toISOString()}`,
    `Overall=${summary}`,
    `TotalChecks=${results.length}`,
    `Passed=${results.filter((item) => item.ok).length}`,
    `Failed=${results.filter((item) => !item.ok).length}`,
    "",
    ...results.map(toLine),
    "",
  ];

  return {
    summary,
    text: lines.join("\n"),
    generatedAt: now,
  };
};

const saveReport = (text, generatedAt, html) => {
  fs.mkdirSync(reportDir, { recursive: true });

  const stamp = generatedAt.toISOString().replace(/[:.]/g, "-");
  const reportTextPath = path.join(reportDir, `healthcheck-${stamp}.txt`);
  const reportHtmlPath = path.join(reportDir, `healthcheck-${stamp}.html`);

  fs.writeFileSync(reportTextPath, text, "utf8");
  fs.writeFileSync(reportHtmlPath, html, "utf8");

  return { reportTextPath, reportHtmlPath };
};

const saveLatestStatus = (payload) => {
  fs.mkdirSync(reportDir, { recursive: true });
  fs.writeFileSync(latestStatusPath, JSON.stringify(payload, null, 2), "utf8");
};

const sendEmail = async ({ subject, text, html, attachments, emailTo }) => {
  const host = process.env.HOST;
  const port = Number(process.env.EMAIL_PORT || 465);
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!host || !port || !user || !pass || !emailTo || !EMAIL_FROM) {
    throw new Error(
      "Missing email config. Ensure HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS, and a recipient email are available."
    );
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: true,
    auth: { user, pass },
  });

  await transporter.sendMail({
    from: EMAIL_FROM,
    to: emailTo,
    subject,
    text,
    html,
    attachments,
  });
};

(async () => {
  const globalSettingData = await getGlobalSettingData();

  const configuredPublicUrls = parseUrlList(
    process.env.HEALTHCHECK_PUBLIC_URLS || globalSettingData?.healthcheck_public_urls
  );
  const fallbackWebsite = normalizeWebsiteToUrl(globalSettingData?.website);
  const publicUrls =
    configuredPublicUrls.length > 0
      ? configuredPublicUrls
      : fallbackWebsite
        ? [fallbackWebsite]
        : [];

  const checkoutPath = normalizeApiPath(
    process.env.HEALTHCHECK_CHECKOUT_SANITY_PATH ||
      globalSettingData?.healthcheck_checkout_sanity_path ||
      "/v1/coupon/show"
  );
  const checkoutUrl = resolveApiUrl(API_BASE_URL, checkoutPath);
  const thresholds = getThresholds(globalSettingData);

  const baseChecks = [
    withTimeout(STORE_URL, DEFAULT_TIMEOUT_MS, {
      name: "Storefront home",
    }),
    withTimeout(API_URL, DEFAULT_TIMEOUT_MS, {
      name: "API global setting",
    }),
    withTimeout(checkoutUrl, DEFAULT_TIMEOUT_MS, {
      name: "Checkout-flow sanity",
      validate: validateCheckoutSanityResponse,
    }),
    checkMongoConnection(DEFAULT_TIMEOUT_MS),
  ];

  const publicChecks = publicUrls.map((url, index) =>
    withTimeout(url, DEFAULT_TIMEOUT_MS, {
      name: `Public domain check #${index + 1}`,
    })
  );

  const sslChecks = publicUrls.map((url, index) =>
    checkSslExpiry(url, thresholds.sslDays, DEFAULT_TIMEOUT_MS).then((result) => ({
      ...result,
      name: `SSL expiry check #${index + 1}`,
    }))
  );

  const resourceChecksPromise = checkServerResources(thresholds);

  const checks = await Promise.all([...baseChecks, ...publicChecks, ...sslChecks]);
  const resourceChecks = await resourceChecksPromise;
  checks.push(...resourceChecks);

  const { summary, text, generatedAt } = buildReport(checks);
  const dashboardModel = buildDashboardModel({
    summary,
    generatedAt,
    checks,
    thresholds,
  });
  const htmlReport = buildHtmlReport(dashboardModel);
  const { reportTextPath, reportHtmlPath } = saveReport(text, generatedAt, htmlReport);

  console.log(text);
  console.log(`ReportSaved=${reportTextPath}`);
  console.log(`HtmlReportSaved=${reportHtmlPath}`);

  const skipEmail = process.argv.includes("--no-email");

  if (skipEmail) {
    saveLatestStatus({
      generated_at: generatedAt.toISOString(),
      overall: summary,
      report_path: reportTextPath,
      report_html_path: reportHtmlPath,
      email_sent: false,
      email_to: "",
      mode: "no-email",
      checks,
      thresholds,
      score: dashboardModel.score,
      protection_level: dashboardModel.protectionLevel,
    });
    process.exit(summary === "PASS" ? 0 : 1);
  }

  const subject = `[Babys Healthcheck] ${summary} - ${generatedAt
    .toISOString()
    .slice(0, 10)}`;

  const emailTo = await resolveDynamicEmailTo();
  const emailHtml = buildEmailHtml(dashboardModel);

  await sendEmail({
    subject,
    text,
    html: emailHtml,
    emailTo,
    attachments: [
      {
        filename: path.basename(reportHtmlPath),
        path: reportHtmlPath,
      },
      {
        filename: path.basename(reportTextPath),
        path: reportTextPath,
      },
    ],
  });
  saveLatestStatus({
    generated_at: generatedAt.toISOString(),
    overall: summary,
    report_path: reportTextPath,
    report_html_path: reportHtmlPath,
    email_sent: true,
    email_to: emailTo,
    mode: "email",
    checks,
    thresholds,
    score: dashboardModel.score,
    protection_level: dashboardModel.protectionLevel,
  });
  console.log(`EmailSentTo=${emailTo}`);

  process.exit(summary === "PASS" ? 0 : 1);
})().catch((error) => {
  try {
    saveLatestStatus({
      generated_at: new Date().toISOString(),
      overall: "FAIL",
      report_path: "",
      email_sent: false,
      email_to: "",
      mode: "error",
      error: error.message,
      checks: [],
      thresholds: {},
    });
  } catch {
    // Swallow write errors so original failure is preserved.
  }
  console.error("Healthcheck failed:", error.message);
  process.exit(1);
});
