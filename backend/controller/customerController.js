require("dotenv").config();
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const Customer = require("../models/Customer");
const PhoneVerification = require("../models/PhoneVerification");
const {
  tokenForVerify,
  generateAccessToken,
  generateRefreshToken,
} = require("../config/auth");
const { sendEmail } = require("../lib/email-sender/sender");
const {
  customerRegisterBody,
} = require("../lib/email-sender/templates/register");
const {
  forgetPasswordEmailBody,
} = require("../lib/email-sender/templates/forget-password");
const { sendVerificationCode } = require("../lib/phone-verification/sender");

const isPrivilegedRole = (role) => {
  const normalizedRole = String(role || "").toLowerCase().trim();
  return normalizedRole === "admin" || normalizedRole === "super admin";
};

const canAccessCustomer = (req, customerId) => {
  if (isPrivilegedRole(req?.user?.role)) return true;
  return String(req?.user?._id || "") === String(customerId || "");
};

const OTP_EXP_MINUTES = 10;
const OTP_MAX_ATTEMPTS = 5;

const hashOtp = (otpCode) =>
  crypto
    .createHash("sha256")
    .update(`${String(otpCode || "")}:${process.env.JWT_SECRET_FOR_VERIFY || "otp-secret"}`)
    .digest("hex");

const normalizePhone = (phone) => String(phone || "").trim();

const isValidPhoneNumber = (phone) => /^\+?[1-9]\d{7,14}$/.test(phone);

const createPhoneVerificationToken = (phone) => {
  return jwt.sign(
    { phone, purpose: "phone_verification" },
    process.env.JWT_SECRET_FOR_VERIFY,
    { expiresIn: "30m" }
  );
};

const verifyPhoneVerificationToken = (token, expectedPhone) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET_FOR_VERIFY);
  return (
    decoded?.purpose === "phone_verification" &&
    String(decoded?.phone || "") === String(expectedPhone || "")
  );
};

const verifyEmailAddress = async (req, res) => {
  const isAdded = await Customer.findOne({ email: req.body.email });
  if (isAdded) {
    return res.status(403).send({
      message: "This Email already Added!",
    });
  } else {
    const token = tokenForVerify(req.body);
    const option = {
      name: req.body.name,
      email: req.body.email,
      token: token,
    };
    const body = {
      from: process.env.EMAIL_USER,
      // from: "info@demomailtrap.com",
      to: `${req.body.email}`,
      subject: "Email Activation",
      subject: "Verify Your Email",
      html: customerRegisterBody(option),
    };

    const message = "Please check your email to verify your account!";
    sendEmail(body, res, message);
  }
};

const checkEmailAvailability = async (req, res) => {
  try {
    const email = String(req.query.email || "")
      .trim()
      .toLowerCase();

    if (!email) {
      return res.status(400).send({
        available: false,
        message: "Email is required.",
      });
    }

    const existingCustomer = await Customer.findOne({ email });

    if (existingCustomer) {
      return res.send({
        available: false,
        message: "This email is already registered. Please use a different email.",
      });
    }

    return res.send({
      available: true,
      message: "Email is available.",
    });
  } catch (err) {
    return res.status(500).send({
      available: false,
      message: err.message,
    });
  }
};

const verifyPhoneNumber = async (req, res) => {
  const phoneNumber = normalizePhone(req.body.phone);

  // console.log("verifyPhoneNumber", phoneNumber);

  // Check if phone number is provided and is in the correct format
  if (!phoneNumber) {
    return res.status(400).send({
      message: "Phone number is required.",
    });
  }

  if (!isValidPhoneNumber(phoneNumber)) {
    return res.status(400).send({
      message: "Invalid phone number format.",
    });
  }

  // Optional: Add phone number format validation here (if required)
  // const phoneRegex = /^[0-9]{10}$/; // Basic validation for 10-digit phone numbers
  // if (!phoneRegex.test(phoneNumber)) {
  //   return res.status(400).send({
  //     message: "Invalid phone number format. Please provide a valid number.",
  //   });
  // }

  try {
    // Check if the phone number is already associated with an existing customer
    const isAdded = await Customer.findOne({ phone: phoneNumber });

    if (isAdded) {
      return res.status(403).send({
        message: "This phone number is already added.",
      });
    }

    // Generate and persist a one-time code (hashed).
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const expiresAt = new Date(Date.now() + OTP_EXP_MINUTES * 60 * 1000);

    const verificationDoc = await PhoneVerification.findOneAndUpdate(
      { phone: phoneNumber },
      {
        $set: {
          codeHash: hashOtp(verificationCode),
          expiresAt,
          attempts: 0,
          verified: false,
        },
      },
      { upsert: true, new: true }
    );

    // Send verification code via SMS
    const sent = await sendVerificationCode(phoneNumber, verificationCode);

    if (!sent) {
      return res.status(500).send({
        message: "Failed to send verification code.",
      });
    }

    const message = "Please check your phone for the verification code!";
    return res.send({
      message,
      verificationId: verificationDoc._id,
      expiresIn: OTP_EXP_MINUTES * 60,
    });
  } catch (err) {
    console.error("Error during phone verification:", err);
    res.status(500).send({
      message: err.message,
    });
  }
};

const confirmPhoneVerification = async (req, res) => {
  try {
    const phone = normalizePhone(req.body.phone);
    const otp = String(req.body.otp || "").trim();
    const verificationId = String(req.body.verificationId || "").trim();

    if (!phone || !otp || !verificationId) {
      return res.status(400).send({
        message: "phone, otp and verificationId are required.",
      });
    }

    const verification = await PhoneVerification.findOne({
      _id: verificationId,
      phone,
    });

    if (!verification) {
      return res.status(404).send({ message: "Verification record not found." });
    }

    if (verification.verified) {
      const token = createPhoneVerificationToken(phone);
      return res.send({
        message: "Phone already verified.",
        phoneVerificationToken: token,
      });
    }

    if (verification.expiresAt < new Date()) {
      return res.status(410).send({ message: "Verification code expired." });
    }

    if (verification.attempts >= OTP_MAX_ATTEMPTS) {
      return res.status(429).send({ message: "Too many invalid attempts." });
    }

    const isValidCode = verification.codeHash === hashOtp(otp);

    if (!isValidCode) {
      verification.attempts += 1;
      await verification.save();
      return res.status(401).send({ message: "Invalid verification code." });
    }

    verification.verified = true;
    await verification.save();

    const phoneVerificationToken = createPhoneVerificationToken(phone);

    return res.send({
      message: "Phone number verified successfully.",
      phoneVerificationToken,
    });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

const registerCustomer = async (req, res) => {
  const token = req.params.token;

  try {
    const { name, email, password, phone } = jwt.decode(token);

    if (phone) {
      const phoneVerificationToken = String(
        req.body.phoneVerificationToken || ""
      ).trim();

      if (!phoneVerificationToken) {
        return res.status(400).send({
          message: "Phone verification is required before registration.",
        });
      }

      let isValidPhoneToken = false;
      try {
        isValidPhoneToken = verifyPhoneVerificationToken(
          phoneVerificationToken,
          normalizePhone(phone)
        );
      } catch (err) {
        isValidPhoneToken = false;
      }

      if (!isValidPhoneToken) {
        return res.status(401).send({
          message: "Invalid or expired phone verification token.",
        });
      }
    }

    // Check if the user is already registered
    const isAdded = await Customer.findOne({ email });

    if (isAdded) {
      const accessToken = generateAccessToken(isAdded);
      const refreshToken = generateRefreshToken(isAdded);
      await isAdded.save();

      return res.send({
        refreshToken,
        token: accessToken,
        _id: isAdded._id,
        name: isAdded.name,
        email: isAdded.email,
        password: password,
        message: "Email Already Verified!",
      });
    }

    if (token) {
      jwt.verify(
        token,
        process.env.JWT_SECRET_FOR_VERIFY,
        async (err, decoded) => {
          if (err) {
            return res.status(401).send({
              message: "Token Expired, Please try again!",
            });
          }

          // Create a new user only if not already registered
          const existingUser = await Customer.findOne({ email });
          console.log("existingUser");

          if (existingUser) {
            return res.status(400).send({ message: "User already exists!" });
          } else {
            const newUser = new Customer({
              name,
              email,
              phone,
              password: bcrypt.hashSync(password),
            });

            await newUser.save();
            const accessToken = generateAccessToken(newUser);
            const refreshToken = generateRefreshToken(newUser);
            await newUser.save();
            res.send({
              refreshToken,
              token: accessToken,
              _id: newUser._id,
              name: newUser.name,
              email: newUser.email,
              message: "Email Verified, Please Login Now!",
            });
          }
        }
      );
    }
  } catch (error) {
    console.error("Error during email verification:", error);
    res.status(500).send({
      message: "Internal server error. Please try again later.",
    });
  }
};

const addAllCustomers = async (req, res) => {
  try {
    await Customer.deleteMany();
    await Customer.insertMany(req.body);
    res.send({
      message: "Added all users successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const loginCustomer = async (req, res) => {
  try {
    const customer = await Customer.findOne({ email: req.body.email });

    // console.log("loginCustomer", req.body.password, "customer", customer);

    if (
      customer &&
      customer.password &&
      bcrypt.compareSync(req.body.password, customer.password)
    ) {
      const accessToken = generateAccessToken(customer);
      const refreshToken = generateRefreshToken(customer);
      await customer.save();

      res.send({
        refreshToken,
        token: accessToken,
        _id: customer._id,
        name: customer.name,
        email: customer.email,
        address: customer.address,
        phone: customer.phone,
        image: customer.image,
      });
    } else {
      res.status(401).send({
        message: "Invalid user or password!",
        error: "Invalid user or password!",
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
      error: "Invalid user or password!",
    });
  }
};

const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token required" });
  }

  try {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const user = await Customer.findById(decoded.id);
    if (!user) return res.status(401).json({ message: "User not found" });

    // (Optional) check against DB if you store refresh tokens
    // if (user.refreshToken !== refreshToken) {
    //   return res.status(401).json({ message: "Invalid refresh token" });
    // }

    // Issue new access token
    const accessToken = generateAccessToken(user);

    res.json({
      accessToken,
      expiresIn: 900, // 15 min
      refreshToken, // reuse old, or generateRefreshToken(user) for rotation
    });
  } catch (err) {
    return res.status(401).json({ message: "Invalid refresh token" });
  }
};

const forgetPassword = async (req, res) => {
  const isAdded = await Customer.findOne({ email: req.body.email });
  if (!isAdded) {
    return res.status(404).send({
      message: "User Not found with this email!",
    });
  } else {
    const token = tokenForVerify(isAdded);
    const option = {
      name: isAdded.name,
      email: isAdded.email,
      token: token,
    };

    const body = {
      from: process.env.EMAIL_USER,
      to: `${req.body.email}`,
      subject: "Password Reset",
      html: forgetPasswordEmailBody(option),
    };

    const message = "Please check your email to reset password!";
    sendEmail(body, res, message);
  }
};

const resetPassword = async (req, res) => {
  const token = req.body.token;
  const { email } = jwt.decode(token);
  const customer = await Customer.findOne({ email: email });

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET_FOR_VERIFY, (err, decoded) => {
      if (err) {
        return res.status(500).send({
          message: "Token expired, please try again!",
        });
      } else {
        customer.password = bcrypt.hashSync(req.body.newPassword);
        customer.save();
        res.send({
          message: "Your password change successful, you can login now!",
        });
      }
    });
  }
};

const changePassword = async (req, res) => {
  try {
    // console.log("changePassword", req.body);
    const requestedEmail = String(req.body.email || "").toLowerCase().trim();

    if (!isPrivilegedRole(req?.user?.role)) {
      const signedInEmail = String(req?.user?.email || "").toLowerCase().trim();
      if (!requestedEmail || requestedEmail !== signedInEmail) {
        return res.status(403).send({ message: "Forbidden" });
      }
    }

    const customer = await Customer.findOne({ email: requestedEmail });

    if (!customer) {
      return res.status(404).send({ message: "Customer not found!" });
    }

    if (!customer.password) {
      return res.status(403).send({
        message:
          "For change password,You need to sign up with email & password!",
      });
    } else if (
      customer &&
      bcrypt.compareSync(req.body.currentPassword, customer.password)
    ) {
      customer.password = bcrypt.hashSync(req.body.newPassword);
      await customer.save();
      res.send({
        message: "Your password change successfully!",
      });
    } else {
      res.status(401).send({
        message: "Invalid email or current password!",
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const signUpWithOauthProvider = async (req, res) => {
  try {
    const isAdded = await Customer.findOne({ email: req.body.email });
    let user;

    if (isAdded) {
      user = isAdded;
    } else {
      user = new Customer({
        name: req.body.name,
        email: req.body.email,
        image: req.body.image,
      });
      await user.save();
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    await user.save();

    res.send({
      refreshToken,
      token: accessToken,
      _id: user._id,
      name: user.name,
      email: user.email,
      image: user.image,
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const getAllCustomers = async (req, res) => {
  try {
    const users = await Customer.find({}).sort({ _id: -1 });
    res.send(users);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const getCustomerById = async (req, res) => {
  try {
    if (!canAccessCustomer(req, req.params.id)) {
      return res.status(403).send({ message: "Forbidden" });
    }

    const customer = await Customer.findById(req.params.id);
    res.send(customer);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

// Shipping address create or update
const addShippingAddress = async (req, res) => {
  try {
    const customerId = req.params.id;
    const newShippingAddress = req.body;

    if (!canAccessCustomer(req, customerId)) {
      return res.status(403).send({ message: "Forbidden" });
    }

    // console.log("customerId", customerId);

    // Find the customer by ID and update the shippingAddress field
    const result = await Customer.updateOne(
      { _id: customerId },
      {
        $set: {
          shippingAddress: newShippingAddress,
        },
      },
      { upsert: true } // Create a new document if no document matches the filter
    );

    // console.log("result", result);

    if (result.modifiedCount > 0) {
      return res.send({
        message: "Shipping address added or updated successfully.",
      });
    } else {
      return res.status(404).send({ message: "Customer not found." });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getShippingAddress = async (req, res) => {
  try {
    const customerId = req.params.id;

    if (!canAccessCustomer(req, customerId)) {
      return res.status(403).send({ message: "Forbidden" });
    }

    // const addressId = req.query.id;

    // console.log("getShippingAddress", customerId);
    // console.log("addressId", req.query);

    const customer = await Customer.findById(customerId);
    res.send({ shippingAddress: customer?.shippingAddress });

    // if (addressId) {
    //   // Find the specific address by its ID
    //   const address = customer.shippingAddress.find(
    //     (addr) => addr._id.toString() === addressId.toString()
    //   );

    //   if (!address) {
    //     return res.status(404).send({
    //       message: "Shipping address not found!",
    //     });
    //   }

    //   return res.send({ shippingAddress: address });
    // } else {
    //   res.send({ shippingAddress: customer?.shippingAddress });
    // }
  } catch (err) {
    // console.error("Error adding shipping address:", err);
    res.status(500).send({
      message: err.message,
    });
  }
};

const updateShippingAddress = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!canAccessCustomer(req, userId)) {
      return res.status(403).send({ message: "Forbidden" });
    }

    const updated = await Customer.updateOne(
      { _id: userId },
      { $set: { shippingAddress: req.body } }
    );

    if (updated.matchedCount === 0) {
      return res.status(404).send({ message: "Customer not found." });
    }

    res.send({ message: "Shipping address updated successfully." });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const deleteShippingAddress = async (req, res) => {
  try {
    const { userId, shippingId } = req.params;

    if (!canAccessCustomer(req, userId)) {
      return res.status(403).send({ message: "Forbidden" });
    }

    await Customer.updateOne(
      { _id: userId },
      {
        $pull: {
          shippingAddress: { _id: shippingId },
        },
      }
    );

    res.send({ message: "Shipping Address Deleted Successfully!" });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const updateCustomer = async (req, res) => {
  try {
    if (!canAccessCustomer(req, req.params.id)) {
      return res.status(403).send({ message: "Forbidden" });
    }

    const { name, email, address, phone, image } = req.body;

    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).send({ message: "Customer not found!" });
    }

    const existingCustomer = await Customer.findOne({ email });
    if (
      existingCustomer &&
      existingCustomer._id.toString() !== customer._id.toString()
    ) {
      return res.status(400).send({ message: "Email already exists." });
    }

    customer.name = name;
    customer.email = email;
    customer.address = address;
    customer.phone = phone;
    customer.image = image;

    await customer.save();

    const accessToken = generateAccessToken(customer);
    const refreshToken = generateRefreshToken(customer);
    await customer.save();

    res.send({
      refreshToken,
      token: accessToken,
      _id: customer._id,
      name: customer.name,
      email: customer.email,
      address: customer.address,
      phone: customer.phone,
      image: customer.image,
      message: "Customer updated successfully!",
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const deleteCustomer = (req, res) => {
  Customer.deleteOne({ _id: req.params.id }, (err) => {
    if (err) {
      res.status(500).send({
        message: err.message,
      });
    } else {
      res.status(200).send({
        message: "User Deleted Successfully!",
      });
    }
  });
};

module.exports = {
  loginCustomer,
  refreshToken,
  verifyPhoneNumber,
  confirmPhoneVerification,
  registerCustomer,
  addAllCustomers,
  signUpWithOauthProvider,
  checkEmailAvailability,
  verifyEmailAddress,
  forgetPassword,
  changePassword,
  resetPassword,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  addShippingAddress,
  getShippingAddress,
  updateShippingAddress,
  deleteShippingAddress,
};
