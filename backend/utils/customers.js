const bcrypt = require("bcryptjs");
const DEFAULT_SEED_PASSWORD = process.env.SAFE_SEED_PASSWORD || "ChangeMe123!";
const customers = require("./customers.json");

module.exports = customers.map((customer) => ({
  ...customer,
  password: bcrypt.hashSync(DEFAULT_SEED_PASSWORD),
}));
