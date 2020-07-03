const mongoose = require("../config/mongoose");
const Employee = require("./User");

const SALT_ROUNDS = 8;

const { Schema } = mongoose;
const { Types } = Schema;

const companySchema = new Schema({
  CompanyName: {
    type: String,
    required: true
  },
  CompanyCode: {
    type: String,
    required: true
  },
  Employees: [Employee]
});

const Company = mongoose.model("CompanyCodes", userSchema);

module.exports = Company;
