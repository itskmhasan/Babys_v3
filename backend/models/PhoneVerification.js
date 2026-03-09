const mongoose = require("mongoose");

const phoneVerificationSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
      index: true,
    },
    codeHash: {
      type: String,
      required: true,
    },
    attempts: {
      type: Number,
      default: 0,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-remove expired OTP records.
phoneVerificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const PhoneVerification = mongoose.model(
  "PhoneVerification",
  phoneVerificationSchema
);

module.exports = PhoneVerification;
