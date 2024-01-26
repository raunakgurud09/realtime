import supertest from "supertest";
import * as UserController from "../controllers/auth/user.controllers";
import { app } from "../app";
import mongoose from "mongoose";

const userInput = {
  email: "test@gmail.com",
  username: "test_user",
  password: "test123",
};

const userPayload = {
  data: {},
};

describe("user", () => {
  beforeEach(async () => {
    await mongoose.connect(process.env.MONGODB_URI);
  });

  /* Dropping the database and closing connection after each test. */
  afterEach(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  describe("healthcheck", () => {
    it("should work", async () => {
      const { statusCode } = await supertest(app).get("/api/v1/healthcheck");

      expect(statusCode).toBe(200);
    });
  });

  describe("user registration", () => {
    describe("when  user enters valid email and password", () => {
      it("should return 201", async () => {
        const { statusCode, body } = await supertest(app)
          .post("/api/v1/users/register")
          .send(userInput);

        expect(statusCode).toBe(201);
        expect(body.data.user.username).toBe("test_user");
      });
    });

    describe("user service throws err", () => {
      it("should handle the err return 409", () => {});
    });
  });

  describe("user login", () => {
    describe("when  user enters valid email and password", () => {
      it("login user", () => {});
    });

    describe("user incorrect password", () => {
      it("should handle the err return 400", () => {});
    });
  });
});
