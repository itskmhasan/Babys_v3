const escapeRegex = (value = "") => {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const sanitizeSearchTerm = (value, maxLength = 80) => {
  const raw = String(value || "").trim();
  if (!raw) return "";
  return raw.slice(0, maxLength);
};

const buildSafeRegex = (value, options = "i", maxLength = 80) => {
  const sanitized = sanitizeSearchTerm(value, maxLength);
  if (!sanitized) return null;
  return { $regex: escapeRegex(sanitized), $options: options };
};

const toBoundedInt = (value, defaultValue, minValue, maxValue) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return defaultValue;
  return Math.max(minValue, Math.min(maxValue, Math.trunc(parsed)));
};

module.exports = {
  escapeRegex,
  sanitizeSearchTerm,
  buildSafeRegex,
  toBoundedInt,
};
