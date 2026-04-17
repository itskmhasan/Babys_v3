const { execSync, execFile } = require("child_process");
const path = require("path");

const appRoot = process.env.APP_ROOT || path.resolve(__dirname, "../..");
const backendDir = path.join(appRoot, "backend");
const nodeBin = process.env.HEALTHCHECK_NODE_BIN || "/usr/bin/node";
const logPath = path.join(appRoot, "deploy/reports/healthcheck-cron.log");
const scriptPath = "script/healthcheck-report.js";

const parseTime = (time = "08:00") => {
  const match = String(time).trim().match(/^([01]?\d|2[0-3]):([0-5]\d)$/);
  if (!match) {
    return { hour: 8, minute: 0, normalized: "08:00" };
  }

  const hour = Number(match[1]);
  const minute = Number(match[2]);
  return {
    hour,
    minute,
    normalized: `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`,
  };
};

const buildCronLine = (time = "08:00") => {
  const { hour, minute } = parseTime(time);
  return `${minute} ${hour} * * * cd ${backendDir} && ${nodeBin} ${scriptPath} >> ${logPath} 2>&1`;
};

const readCurrentCrontab = () => {
  try {
    return execSync("crontab -l 2>/dev/null || true", {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    });
  } catch {
    return "";
  }
};

const writeCrontab = (content) => {
  const safeContent = `${String(content || "").trim()}\n`;
  execSync("crontab -", {
    input: safeContent,
    encoding: "utf8",
    stdio: ["pipe", "ignore", "pipe"],
  });
};

const syncHealthcheckCrontab = ({ enabled, time }) => {
  const current = readCurrentCrontab();
  const lines = current
    .split("\n")
    .map((line) => line.trimEnd())
    .filter((line) => line && !line.includes(scriptPath));

  const cronLine = buildCronLine(time);
  if (enabled) {
    lines.push(cronLine);
  }

  writeCrontab(lines.join("\n"));

  return {
    enabled: Boolean(enabled),
    time: parseTime(time).normalized,
    cronLine: enabled ? cronLine : null,
  };
};

const getHealthcheckCrontabStatus = () => {
  const current = readCurrentCrontab();
  const line = current
    .split("\n")
    .map((item) => item.trim())
    .find((item) => item.includes(scriptPath));

  return {
    enabled: Boolean(line),
    line: line || null,
  };
};

const runHealthcheckNow = () => {
  return new Promise((resolve, reject) => {
    execFile(nodeBin, [scriptPath], { cwd: backendDir }, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(stderr || stdout || error.message));
        return;
      }

      resolve({
        stdout: String(stdout || ""),
        stderr: String(stderr || ""),
      });
    });
  });
};

module.exports = {
  parseTime,
  syncHealthcheckCrontab,
  getHealthcheckCrontabStatus,
  runHealthcheckNow,
};
