require("dotenv").config();
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const signInToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      address: user.address,
      phone: user.phone,
      image: user.image,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );
};

const generateAccessToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      address: user.address,
      phone: user.phone,
      image: user.image,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_ACCESS_LIFETIME || "24h" } // short-lived
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_LIFETIME || "30d" } // longer-lived
  );
};

const tokenForVerify = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      password: user.password,
    },
    process.env.JWT_SECRET_FOR_VERIFY,
    { expiresIn: "24h" }
  );
};

const isAuth = async (req, res, next) => {
  const { authorization } = req.headers;
  // console.log("authorization", req.headers);
  console.log(`🔍isAuth ${req.method} : ${req.originalUrl}`);
  try {
    if (!authorization) {
      return res.status(401).send({
        message: "Authorization header missing",
      });
    }
    
    const token = authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.log("error on isAuth", err.message);

    // If token expired, allow frontend to refresh
    if (err.name === "TokenExpiredError") {
      return res.status(401).send({
        message: "Session expired || Login again",
        code: "TOKEN_EXPIRED",
      });
    }

    res.status(401).send({
      message: err.message,
    });
  }
};

const hasAnyRole = (userRole, roles = []) => {
  const normalizedUserRole = String(userRole || "").toLowerCase().trim();
  return roles
    .map((role) => String(role || "").toLowerCase().trim())
    .includes(normalizedUserRole);
};

const requireRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).send({
        message: "Unauthorized",
      });
    }

    if (!hasAnyRole(req.user.role, roles)) {
      return res.status(403).send({
        message: "Forbidden",
      });
    }

    next();
  };
};

const isAdmin = requireRoles("admin", "super admin");
const isSuperAdmin = requireRoles("super admin");

const secretKey = process.env.ENCRYPT_PASSWORD;

// Ensure the secret key is exactly 32 bytes (256 bits)
const key = crypto.createHash("sha256").update(secretKey).digest();

// Generate an initialization vector (IV)
const iv = crypto.randomBytes(16); // AES-CBC requires a 16-byte IV

// Helper function to encrypt data
const handleEncryptData = (data) => {
  // Ensure the input is a string or convert it to a string
  const dataToEncrypt = typeof data === "string" ? data : JSON.stringify(data);

  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  let encryptedData = cipher.update(dataToEncrypt, "utf8", "hex");
  encryptedData += cipher.final("hex");

  return {
    data: encryptedData,
    iv: iv.toString("hex"),
  };
};

module.exports = {
  isAuth,
  isAdmin,
  isSuperAdmin,
  requireRoles,
  signInToken,
  tokenForVerify,
  handleEncryptData,
  generateAccessToken,
  generateRefreshToken,
};
