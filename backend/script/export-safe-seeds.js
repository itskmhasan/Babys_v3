require("dotenv").config();

const fs = require("fs");
const path = require("path");

const { connectDB } = require("../config/db");

const Admin = require("../models/Admin");
const Attribute = require("../models/Attribute");
const Category = require("../models/Category");
const Coupon = require("../models/Coupon");
const Currency = require("../models/Currency");
const Customer = require("../models/Customer");
const Language = require("../models/Language");
const Order = require("../models/Order");
const Product = require("../models/Product");
const Review = require("../models/Review");
const Setting = require("../models/Setting");

const OUTPUT_DIR = path.join(__dirname, "../utils");
const DEFAULT_SEED_PASSWORD = process.env.SAFE_SEED_PASSWORD || "ChangeMe123!";
const REDACTED = "[REDACTED]";

const SENSITIVE_KEYWORD_PATTERNS = [
  /password/i,
  /secret/i,
  /token/i,
  /private/i,
  /auth/i,
];

const SENSITIVE_PROVIDER_KEY_PATTERNS = [
  /stripe.*key/i,
  /stripe.*id/i,
  /paypal.*key/i,
  /paypal.*id/i,
  /razorpay.*key/i,
  /razorpay.*id/i,
  /cloudinary.*key/i,
  /cloudinary.*id/i,
  /twilio.*key/i,
  /twilio.*id/i,
  /google.*secret/i,
  /google.*id/i,
  /github.*secret/i,
  /github.*id/i,
  /facebook.*secret/i,
  /facebook.*id/i,
  /nextauth.*secret/i,
  /api.*key/i,
  /access.*key/i,
  /client.*key/i,
];

const COLLECTIONS = [
  {
    model: Admin,
    jsonFile: "admins.json",
    jsFile: "admin.js",
    sanitize: sanitizeAdmin,
    wrapper: "admin",
  },
  {
    model: Customer,
    jsonFile: "customers.json",
    jsFile: "customers.js",
    sanitize: sanitizeCustomer,
    wrapper: "customer",
  },
  {
    model: Category,
    jsonFile: "categories.json",
    jsFile: "categories.js",
    sanitize: sanitizeGeneric,
    wrapper: "plain",
  },
  {
    model: Product,
    jsonFile: "products.json",
    jsFile: "products.js",
    sanitize: sanitizeProduct,
    wrapper: "plain",
  },
  {
    model: Product,
    jsonFile: "product-with-reviews.json",
    jsFile: "product-with-reviews.js",
    sanitize: sanitizeProduct,
    wrapper: "plain",
  },
  {
    model: Attribute,
    jsonFile: "attributes.json",
    jsFile: "attributes.js",
    sanitize: sanitizeGeneric,
    wrapper: "plain",
  },
  {
    model: Coupon,
    jsonFile: "coupons.json",
    jsFile: "coupon.js",
    sanitize: sanitizeGeneric,
    wrapper: "plain",
  },
  {
    model: Currency,
    jsonFile: "currencies.json",
    jsFile: "currency.js",
    sanitize: sanitizeGeneric,
    wrapper: "plain",
  },
  {
    model: Order,
    jsonFile: "orders.json",
    jsFile: "orders.js",
    sanitize: sanitizeOrder,
    wrapper: "plain",
  },
  {
    model: Language,
    jsonFile: "languages.json",
    jsFile: "language.js",
    sanitize: sanitizeGeneric,
    wrapper: "plain",
  },
  {
    model: Review,
    jsonFile: "reviews.json",
    jsFile: "reviews.js",
    sanitize: sanitizeReview,
    wrapper: "plain",
  },
  {
    model: Setting,
    jsonFile: "settings.json",
    jsFile: "settings.js",
    sanitize: sanitizeSetting,
    wrapper: "plain",
  },
];

function isObjectId(value) {
  return Boolean(value && typeof value === "object" && value._bsontype === "ObjectId");
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value) && !(value instanceof Date);
}

function normalizeValue(value) {
  if (value == null) return value;
  if (value instanceof Date) return value.toISOString();
  if (isObjectId(value)) return value.toString();
  if (Array.isArray(value)) return value.map(normalizeValue);
  if (isPlainObject(value)) {
    return Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => [key, normalizeValue(nestedValue)])
    );
  }
  return value;
}

function stripMeta(document) {
  const normalized = normalizeValue(document);
  if (!isPlainObject(normalized)) return normalized;

  const clone = { ...normalized };
  delete clone.__v;
  delete clone.createdAt;
  delete clone.updatedAt;
  return clone;
}

function padNumber(value) {
  return String(value).padStart(4, "0");
}

function sanitizeNameField(name, fallback) {
  if (isPlainObject(name)) {
    return Object.fromEntries(Object.keys(name).map((key) => [key, fallback]));
  }
  return fallback;
}

function sanitizeAddress(index) {
  return `Demo Address ${index + 1}, Dhaka`;
}

function sanitizeAdmin(admin, index) {
  const clone = stripMeta(admin);
  delete clone.password;

  return {
    ...clone,
    name: sanitizeNameField(clone.name, `Demo Admin ${index + 1}`),
    email: `admin${index + 1}@example.com`,
    phone: `+8801700${padNumber(index + 1)}`,
    address: sanitizeAddress(index),
    city: "Dhaka",
    country: "Bangladesh",
    image: "",
    joiningData: clone.joiningData || new Date().toISOString(),
  };
}

function sanitizeShippingAddress(shippingAddress, index) {
  if (!isPlainObject(shippingAddress)) return shippingAddress;

  return {
    ...shippingAddress,
    name: `Demo Customer ${index + 1}`,
    email: `customer${index + 1}@example.com`,
    contact: `+8801800${padNumber(index + 1)}`,
    address: sanitizeAddress(index),
    city: "Dhaka",
    country: "Bangladesh",
    zipCode: "1200",
  };
}

function sanitizeCustomer(customer, index) {
  const clone = stripMeta(customer);
  delete clone.password;

  return {
    ...clone,
    name: `Demo Customer ${index + 1}`,
    email: `customer${index + 1}@example.com`,
    phone: `+8801800${padNumber(index + 1)}`,
    image: "",
    address: sanitizeAddress(index),
    city: "Dhaka",
    country: "Bangladesh",
    shippingAddress: sanitizeShippingAddress(clone.shippingAddress, index),
  };
}

function sanitizeOrder(order, index) {
  const clone = stripMeta(order);

  return {
    ...clone,
    cardInfo: undefined,
    user_info: {
      ...clone.user_info,
      name: `Demo Customer ${index + 1}`,
      email: `order${index + 1}@example.com`,
      contact: `+8801900${padNumber(index + 1)}`,
      address: sanitizeAddress(index),
      city: "Dhaka",
      country: "Bangladesh",
      zipCode: "1200",
    },
  };
}

function sanitizeReview(review) {
  return stripMeta(review);
}

function redactSensitiveSettingValue(key, value) {
  const rawKey = String(key || "");

  if (SENSITIVE_KEYWORD_PATTERNS.some((pattern) => pattern.test(rawKey))) {
    return REDACTED;
  }

  if (SENSITIVE_PROVIDER_KEY_PATTERNS.some((pattern) => pattern.test(rawKey))) {
    return REDACTED;
  }

  return value;
}

function sanitizeSettingValue(value) {
  if (Array.isArray(value)) return value.map(sanitizeSettingValue);

  if (isPlainObject(value)) {
    return Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => {
        const redacted = redactSensitiveSettingValue(key, nestedValue);
        return [key, redacted === nestedValue ? sanitizeSettingValue(nestedValue) : redacted];
      })
    );
  }

  return normalizeValue(value);
}

function sanitizeSetting(settingDoc) {
  const clone = stripMeta(settingDoc);
  return {
    ...clone,
    setting: sanitizeSettingValue(clone.setting),
  };
}

function sanitizeProduct(product) {
  return stripMeta(product);
}

function sanitizeGeneric(document) {
  return stripMeta(document);
}

function writeJsonFile(filePath, data) {
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`);
}

function buildWrapperContent(wrapperType, jsonFile) {
  if (wrapperType === "admin") {
    return [
      'const bcrypt = require("bcryptjs");',
      `const DEFAULT_SEED_PASSWORD = process.env.SAFE_SEED_PASSWORD || ${JSON.stringify(DEFAULT_SEED_PASSWORD)};`,
      `const admins = require("./${jsonFile}");`,
      "",
      "module.exports = admins.map((admin) => ({",
      "  ...admin,",
      "  password: bcrypt.hashSync(DEFAULT_SEED_PASSWORD),",
      "}));",
      "",
    ].join("\n");
  }

  if (wrapperType === "customer") {
    return [
      'const bcrypt = require("bcryptjs");',
      `const DEFAULT_SEED_PASSWORD = process.env.SAFE_SEED_PASSWORD || ${JSON.stringify(DEFAULT_SEED_PASSWORD)};`,
      `const customers = require("./${jsonFile}");`,
      "",
      "module.exports = customers.map((customer) => ({",
      "  ...customer,",
      "  password: bcrypt.hashSync(DEFAULT_SEED_PASSWORD),",
      "}));",
      "",
    ].join("\n");
  }

  return [`module.exports = require("./${jsonFile}");`, ""].join("\n");
}

function writeJsWrapper(filePath, wrapperType, jsonFile) {
  fs.writeFileSync(filePath, buildWrapperContent(wrapperType, jsonFile));
}

async function exportCollection({ model, jsonFile, jsFile, sanitize, wrapper }) {
  const documents = await model.find({}).lean();
  const sanitized = documents.map((document, index) => sanitize(document, index));

  writeJsonFile(path.join(OUTPUT_DIR, jsonFile), sanitized);
  writeJsWrapper(path.join(OUTPUT_DIR, jsFile), wrapper, jsonFile);

  return { jsonFile, jsFile, count: sanitized.length };
}

async function run() {
  try {
    await connectDB();

    const results = [];
    for (const collection of COLLECTIONS) {
      const result = await exportCollection(collection);
      results.push(result);
      console.log(`Exported ${result.count} records to ${result.jsonFile} and ${result.jsFile}`);
    }

    console.log("\nSafe seed export complete.");
    console.log(`Default seed password for admins/customers: ${DEFAULT_SEED_PASSWORD}`);
    process.exit(0);
  } catch (error) {
    console.error("Safe seed export failed:", error);
    process.exit(1);
  }
}

run();