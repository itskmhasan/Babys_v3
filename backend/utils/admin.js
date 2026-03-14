const bcrypt = require("bcryptjs");
const DEFAULT_SEED_PASSWORD = process.env.SAFE_SEED_PASSWORD || "ChangeMe123!";
const admins = require("./admins.json");

module.exports = admins.map((admin) => ({
  ...admin,
  password: bcrypt.hashSync(DEFAULT_SEED_PASSWORD),
}));
