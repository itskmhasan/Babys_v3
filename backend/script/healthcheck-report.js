#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const DEFAULT_TIMEOUT_MS = Number(process.env.HEALTHCHECK_TIMEOUT_MS || 10000);
const STORE_URL = process.env.HEALTHCHECK_STORE_URL || "http://127.0.0.1:3000/";
const API_URL =
  process.env.HEALTHCHECK_API_URL || "http://127.0.0.1:5055/v1/setting/global";
const EMAIL_TO = process.env.HEALTHCHECK_EMAIL_TO || process.env.EMAIL_USER;
const EMAIL_FROM = process.env.HEALTHCHECK_EMAIL_FROM || process.env.EMAIL_USER;

const reportDir = path.resolve(__dirname, "../../deploy/reports");

const withTimeout = async (url, timeoutMs) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const startedAt = Date.now();

  try {
    const response = await fetch(url, {
      method: "GET",
      signal: controller.signal,
      headers: {
        "user-agent": "Babys-Healthcheck/1.0",
      },
    });

    const elapsedMs = Date.now() - startedAt;
    const body = await response.text();

    return {
      url,
      ok: response.ok,
      status: response.status,
      elapsedMs,
      bodyPreview: (body || "").slice(0, 180).replace(/\n/g, " "),
      error: null,
    };
  } catch (error) {
    return {
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

const toLine = (result) => {
  const statusLabel = result.ok ? "PASS" : "FAIL";
  const details = result.error
    ? `error=${result.error}`
    : `status=${result.status} preview=\"${result.bodyPreview}\"`;

  return `${statusLabel} url=${result.url} latency_ms=${result.elapsedMs} ${details}`;
};

const buildReport = (results) => {
  const now = new Date();
  const allPass = results.every((item) => item.ok);
  const summary = allPass ? "PASS" : "FAIL";

  const lines = [
    `Babys Daily Health Report`,
    `GeneratedAt=${now.toISOString()}`,
    `Overall=${summary}`,
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

const sendEmail = async (subject, text, attachmentPath) => {
  const host = process.env.HOST;
  const port = Number(process.env.EMAIL_PORT || 465);
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!host || !port || !user || !pass || !EMAIL_TO || !EMAIL_FROM) {
    throw new Error(
      "Missing email config. Ensure HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS, and HEALTHCHECK_EMAIL_TO are set."
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
    to: EMAIL_TO,
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
  const checks = await Promise.all([
    withTimeout(STORE_URL, DEFAULT_TIMEOUT_MS),
    withTimeout(API_URL, DEFAULT_TIMEOUT_MS),
  ]);

  const { summary, text, generatedAt } = buildReport(checks);
  const reportPath = saveReport(text, generatedAt);

  console.log(text);
  console.log(`ReportSaved=${reportPath}`);

  const skipEmail = process.argv.includes("--no-email");

  if (skipEmail) {
    process.exit(summary === "PASS" ? 0 : 1);
  }

  const subject = `[Babys Healthcheck] ${summary} - ${generatedAt
    .toISOString()
    .slice(0, 10)}`;

  await sendEmail(subject, text, reportPath);
  console.log(`EmailSentTo=${EMAIL_TO}`);

  process.exit(summary === "PASS" ? 0 : 1);
})().catch((error) => {
  console.error("Healthcheck failed:", error.message);
  process.exit(1);
});
