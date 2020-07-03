const passport = require("passport");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const jwtConfig = require("./jwt");
const { filterOne } = require("../findOne");

const initPassport = (app, User) => {
  const options = {
    secretOrKey: jwtConfig.secret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
  };
  const verify = (payload, done) => {
    console.log("payload ID" + payload.id);
    console.log("this be thy user " + User.findById(payload.id));

    User.findOne({ CompanyCode: "E2H1" })
      .then(employee => {
        let user = filterOne(employee, "id", payload.id);
        console.log("launched findBYId " + user);
        done(null, user || false);
      })
      .catch(done);
  };
  const strategy = new JwtStrategy(options, verify);
  passport.use(strategy);
  app.use(passport.initialize());
};

const authenticate = () => passport.authenticate("jwt", { session: false });

module.exports = {
  initPassport,
  authenticate
};
