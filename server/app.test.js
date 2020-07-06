const { Company } = require("./models");

require("dotenv").config();
const { UNAUTHORIZED } = require("./utils/http-status-codes");

// dealing with mongoose by using an in-memory mongodb server
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const jwt = require("jsonwebtoken");
const { SECRET } = process.env;

// supertest for testing express api calls
const request = require("supertest");

// this is our express server itself
const { app } = require("./app");

// our in-memory mongodb server
const mongod = new MongoMemoryServer();

/**
 * Connect to a new in-memory database before running any tests.
 */
beforeAll(async () => {
  const uri = await mongod.getUri();
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true
    });
  } catch (e) {
    console.error(e);
  }
});

/**
 * Clear all test data after every test.
 */
afterEach(async () => {
  const collections = mongoose.connection.collections;

  for (const key in collections) {
    if (collections.hasOwnProperty(key)) {
      const collection = collections[key];
      await collection.deleteMany();
    }
  }
});

/**
 * Remove and close the db and server.
 */
afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

describe("Login Endpoint", () => {
  it("should give me unauthorized if I try logging in with bad credentials", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({
        email: "test@test.com",
        password: "haylords"
      });
    expect(res.statusCode).toEqual(UNAUTHORIZED);
    expect(res.error.text).toBe("Unauthorized");
  });

  it("should log me in if I register successfully and try logging in", async () => {
    // create the company code
    await Company.create({ CompanyName: "ShiftRescue", CompanyCode: "6666" });

    // register with the company code
    const registerRes = await request(app)
      .post("/api/users")
      .send({
        email: "test@test.com",
        password: "haylords",
        firstName: "test",
        lastName: "test",
        phoneNumber: "123456789",
        companycode: "6666"
      });
    expect(registerRes.statusCode).toEqual(200);

    // try to login
    const loginRes = await request(app)
      .post("/auth/login")
      .send({
        email: "test@test.com",
        password: "haylords",
        companycode: "6666"
      });
    expect(loginRes.statusCode).toEqual(200);
    expect(loginRes.body).toHaveProperty("token");

    // decode the jwt we get back, and see that it has id, iat, and exp
    const decodedJwt = jwt.verify(loginRes.body.token, SECRET);
    expect(decodedJwt).toHaveProperty("id");
    expect(decodedJwt).toHaveProperty("iat");
    expect(decodedJwt).toHaveProperty("exp");
  });
});
