const mongoose = require("mongoose");
require("dotenv").config();

if (process.env.CI === undefined || process.env.CI === false) {
  mongoose.connect(
    process.env.MONGODB_URI || "mongodb://localhost/time_tracker_db",
    {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true
    }
  );
  console.log("mongoose connect called");
}

module.exports = mongoose;
