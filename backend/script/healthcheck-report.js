#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
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

const saveReport = (text, generatedAt) => {
  fs.mkdirSync(reportDir, { recursive: true });

  const stamp = generatedAt.toISOString().replace(/[:.]/g, "-");
  const reportPath = path.join(reportDir, `healthcheck-${stamp}.txt`);

  fs.writeFileSync(reportPath, text, "utf8");
  return reportPath;
};

const saveLatestStatus = (payload) => {
  fs.mkdirSync(reportDir, { recursive: true });
  fs.writeFileSync(latestStatusPath, JSON.stringify(payload, null, 2), "utf8");
};

const sendEmail = async (subject, text, attachmentPath, emailTo) => {
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
    attachments: [
      {
        filename: path.basename(attachmentPath),
        path: attachmentPath,
      },
    ],
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

  const checks = await Promise.all([...baseChecks, ...publicChecks]);

  const { summary, text, generatedAt } = buildReport(checks);
  const reportPath = saveReport(text, generatedAt);

  console.log(text);
  console.log(`ReportSaved=${reportPath}`);

  const skipEmail = process.argv.includes("--no-email");

  if (skipEmail) {
    saveLatestStatus({
      generated_at: generatedAt.toISOString(),
      overall: summary,
      report_path: reportPath,
      email_sent: false,
      email_to: "",
      mode: "no-email",
      checks,
    });
    process.exit(summary === "PASS" ? 0 : 1);
  }

  const subject = `[Babys Healthcheck] ${summary} - ${generatedAt
    .toISOString()
    .slice(0, 10)}`;

  const emailTo = await resolveDynamicEmailTo();

  await sendEmail(subject, text, reportPath, emailTo);
  saveLatestStatus({
    generated_at: generatedAt.toISOString(),
    overall: summary,
    report_path: reportPath,
    email_sent: true,
    email_to: emailTo,
    mode: "email",
    checks,
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
    });
  } catch {
    // Swallow write errors so original failure is preserved.
  }
  console.error("Healthcheck failed:", error.message);
  process.exit(1);
});
