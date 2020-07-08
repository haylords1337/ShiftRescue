const express = require("express");
const path = require("path");
const logger = require("morgan");
const jwt = require("./config/jwt");
const { Company, Temp } = require("./models");
const {
  UNAUTHORIZED,
  BAD_REQUEST,
  NOT_FOUND,
  SERVER_ERROR
} = require("./utils/http-status-codes");
const MessagingResponse = require("twilio").twiml.MessagingResponse;

const app = express();
app.set("port", process.env.PORT || 3007);
app.use(logger("dev"));
app.use(express.json());

const { initPassport, authenticate } = require("./config/passport");
const { filterOne } = require("./controller/findOne");
initPassport(app, Company);

app.post("/auth/login", (req, res) => {
  const { email, password, companycode } = req.body;
  Company.findOne({ CompanyCode: companycode })
    .then(employees => {
      let user = filterOne(employees, "email", email);
      if (user) {
        return user.verifyPassword(password).then(isVerified => {
          if (isVerified) {
            const jwtPayload = { id: user.id };
            return res.json({ token: jwt.sign(jwtPayload) });
          }
          return Promise.reject();
        });
      }
      return Promise.reject();
    })
    .catch(error => {
      res.status(UNAUTHORIZED).send("Unauthorized");
    });
});

app.post("/api/users", (req, res) => {
  const {
    email,
    password,
    firstName,
    lastName,
    phoneNumber,
    companycode
  } = req.body;
  //Fetch from usertable to make sure no duplicates-
  Company.findOne({ CompanyCode: companycode })
    .then(employees => {
      const user = filterOne(employees, "email", email);
      if (user) {
        return res.status(BAD_REQUEST).send("Account already exists.");
      }

      Company.findOne({ CompanyCode: companycode }).then(results => {
        Temp.create({ email, password, firstName, lastName, phoneNumber })
          .then(employee => {
            results.Employees.push(employee);
            results.save();
            Temp.remove().exec();
            res.end();
          })

          .catch(error => {
            const DUPLICATE_KEY_ERROR_CODE = 11000;
            const { name, code, path } = error;
            if (name === "MongoError" && code === DUPLICATE_KEY_ERROR_CODE) {
              res.status(BAD_REQUEST).send("Email invalid");
            }
            if (name === "ValidationError") {
              res.status(BAD_REQUEST).send("Invalid email or password format.");
            }
            if (name === "Error" && error.message) {
              res.status(BAD_REQUEST).send(error.message);
            }
            res.status(SERVER_ERROR).end();
          });
      });
    })
    .catch(err => {
      console.log(err);
    });
});

app.get("/api/users/:id", authenticate(), (req, res) => {
  // prevent logged in user from accessing other user accounts
  if (req.user.id !== req.params.id) {
    return res.status(UNAUTHORIZED).send("Unauthorized" + req.user.id);
  }
  return Company.findOne({ CompanyCode: "E2H1" }).then(employees => {
    let user = filterOne(employees, "id", req.params.id);

    if (user) {
      return res.json({ user });
    }
    return res.status(NOT_FOUND).send("User not found");
  });
});

app.post("/api/allemployees", (req, res) => {
  const { companycode } = req.body;
  Company.findOne({ CompanyCode: companycode }).then(({ Employees }) => {
    const employees = Employees.filter(employees => {
      if (!employees.boss) {
        return employees;
      }
    });
    res.json(employees);
  });
});

// Serve static assets in production only
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
}

app.post("/api/company", (req, res) => {
  const { company } = req.body;
  Company.findOne({ CompanyCode: company })
    .then(company => {
      if (company) {
        return res.json(company);
      }
      return Promise.reject();
    })
    .catch(error => {
      console.log(error);
      res.status(UNAUTHORIZED).send("Unauthorized");
    });
});
app.post("/send-text", (req, res) => {
  const { recipient } = req.body;
  const { TWILIO_ACCOUNTSID } = process.env;
  const { TWILIO_AUTHTOKEN } = process.env;
  const client = require("twilio")(TWILIO_ACCOUNTSID, TWILIO_AUTHTOKEN);
  client.messages
    .create({
      body: "A Shift is available! Would you like to take it? Reply YES or NO",
      to: recipient,
      from: "+12058906455"
    })
    .then(message => console.log(message.sid));
});

app.post("/conversation", (req, res) => {
  const { recipient } = req.body;
  const { TWILIO_ACCOUNTSID } = process.env;
  const { TWILIO_AUTHTOKEN } = process.env;
  const client = require("twilio")(TWILIO_ACCOUNTSID, TWILIO_AUTHTOKEN);

  client.conversations
    .conversations("CHa36779d0d789479f8320053cc65ad90a")
    .messages.create({
      body: "A Shift is available! Would you like to take it? Reply YES or NO",
      to: recipient,
      from: "+12058906455"
    })
    .then(message => console.log(message.sid));
  // .participants('MB3dfd782ae0bb4f2a931633848d2db517')
});
app.post("/addparticpant", (req, res) => {
  const { phoneNumber } = req.body;
  console.log("PHONE!!!!!" + phoneNumber);
  const { TWILIO_ACCOUNTSID } = process.env;
  const { TWILIO_AUTHTOKEN } = process.env;
  const client = require("twilio")(TWILIO_ACCOUNTSID, TWILIO_AUTHTOKEN);
  client.conversations
    .conversations("CHa36779d0d789479f8320053cc65ad90a")
    .participants.create({
      "messagingBinding.address": `+1${phoneNumber}`,
      "messagingBinding.proxyAddress": "+12058906455"
    })
    .then(participant => {
      client.messages
        .create({
          body:
            "Welcome to the thunderdome!!! We will alert you if there are any available shifts.",
          to: participant.messagingBinding.address,
          from: "+12058906455"
        })
        .then(message => console.log(message.sid));
      console.log(participant.sid);
    })
    .catch(err => console.log(err));
});
app.post("/api/grabshift", (req, res) => {
  const { companycode, email } = req.body;
  Company.findOne({ CompanyCode: companycode }).then(({ Employees }) => {
    const employees = Employees.filter(employees => {
      if (!employees.boss) {
        return employees;
      }
    });
    const appts = employees.map(employees => {
      return employees.schedule.map(appt => {
        return appt;
      });
    });
    console.log("appt" + appts);
    res.json(appts);
  });
});

app.post("/api/createshift", (req, res) => {});

module.exports = { app };
