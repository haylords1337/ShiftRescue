require("dotenv").config();
const { UNAUTHORIZED } = require("./utils/http-status-codes");

// dealing with mongoose by using an in-memory mongodb server
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

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
  const uri = await mongod.getConnectionString();

  const mongooseOpts = {
    useNewUrlParser: true,
    autoReconnect: true,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 1000
  };

  await mongoose.connect(uri, mongooseOpts);
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
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
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
});
