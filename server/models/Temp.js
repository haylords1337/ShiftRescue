const bcrypt = require("bcrypt");
const mongoose = require("../config/mongoose");

const SALT_ROUNDS = 8;

const { Schema } = mongoose;
const { Types } = Schema;

const tempuserSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    // https://tylermcginnis.com/validate-email-address-javascript/
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  password: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  boss: {
    type: Boolean,
    required: true,
    default: false
  },
  phoneNumber: {
    type: Number,
    required: true
  }
});

tempuserSchema.pre("save", function() {
  if (!this.isModified("password")) {
    return Promise.resolve();
  }
  if (this.password.length < 8) {
    return Promise.reject(
      new Error("Password must have at least 8 characters")
    );
  }
  return bcrypt.hash(this.password, SALT_ROUNDS).then(hash => {
    this.password = hash;
  });
});

tempuserSchema.methods.verifyPassword = function(password) {
  return bcrypt.compare(password, this.password);
};

const Temp = mongoose.model("Temp", tempuserSchema);

module.exports = Temp;
