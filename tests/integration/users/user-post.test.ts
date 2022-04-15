import {
  afterAll,
  beforeEach,
  Bson,
  describe,
  expect,
  it,
  superoak,
} from "../../../deps.ts";
import { app } from "../../../app.ts";
import {
  clearCollection,
  createUser,
  generateAccessToken,
} from "../../utils/utils.ts";
import { User } from "../../../models/user.model.ts";
import { admin, user, user2 } from "../../fixtures/users.fixtures.ts";
import { roles } from "../../../config/roles.ts";

describe("Users endpoints POST", () => {
  beforeEach(async () => {
    await clearCollection("users");
  });

  afterAll(async () => {
    await clearCollection("users");
  });

  describe("POST users/", () => {
    it("should create user", async () => {
      const userId = await createUser(admin);
      const token = await generateAccessToken(userId);

      const request = await superoak(app);
      const response = await request.post("/api/users")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send(user)
        .expect(201);
      const dbUser = await User.findOne(
        { _id: new Bson.ObjectId(response.body) },
      );
      expect(typeof response.body).toBe("string");
      expect(response.status).toBe(201);
      expect(dbUser?.name).toBe(user.name);
      expect(dbUser?.email).toBe(user.email);
      expect(dbUser?.role).toBe(user.role);
      expect(dbUser?.isDisabled).toBe(user.isDisabled);
      expect(dbUser?.docVersion).toBe(1);
      expect(dbUser?.createdAt).toBeDefined();
      expect(dbUser?.updatedAt).toBeUndefined();
    });

    it("should conflict if user already exists in database", async () => {
      const userId = await createUser(admin);
      const token = await generateAccessToken(userId);

      const request = await superoak(app);
      const response = await request.post("/api/users")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send(admin)
        .expect(409);

      const dbUsers = await User.find({ email: admin.email }).toArray();
      expect(response.status).toBe(409);
      expect(dbUsers.length).toBe(1);
      expect(response.statusText).toBe("Conflict");
    });

    it("should throw invalid name error", async () => {
      const userId = await createUser(admin);
      const token = await generateAccessToken(userId);
      const invalidUser = { ...user };
      invalidUser.name = "";

      const request = await superoak(app);
      const response = await request.post("/api/users")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send(invalidUser)
        .expect(400);

      const dbUsers = await User.find({ email: invalidUser.email }).toArray();
      expect(response.status).toBe(400);
      expect(dbUsers.length).toBe(0);
      expect(response.body.message).toBe("name must be at least 1 characters");
      expect(response.body.name).toBe("ValidationError");
      expect(response.body.path).toBe("name");
      expect(response.body.type).toBe("min");
      expect(response.statusText).toBe("Bad Request");
    });

    it("should throw max name error", async () => {
      const userId = await createUser(admin);
      const token = await generateAccessToken(userId);
      const invalidUser = { ...user };
      invalidUser.name =
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry" +
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry" +
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry" +
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry" +
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry" +
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry" +
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry" +
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry" +
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry";

      const request = await superoak(app);
      const response = await request.post("/api/users")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send(invalidUser)
        .expect(400);

      const dbUsers = await User.find({ email: invalidUser.email }).toArray();
      expect(response.status).toBe(400);
      expect(dbUsers.length).toBe(0);
      expect(response.body.message).toBe("name must be at most 255 characters");
      expect(response.body.name).toBe("ValidationError");
      expect(response.body.path).toBe("name");
      expect(response.body.type).toBe("max");
      expect(response.statusText).toBe("Bad Request");
    });

    it("should throw missing email error", async () => {
      const userId = await createUser(admin);
      const token = await generateAccessToken(userId);
      const invalidUser = { ...user };
      invalidUser.email = "";

      const request = await superoak(app);
      const response = await request.post("/api/users")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send(invalidUser)
        .expect(400);

      const dbUsers = await User.find({ email: invalidUser.email }).toArray();
      expect(response.status).toBe(400);
      expect(dbUsers.length).toBe(0);
      expect(response.body.message).toBe("email is required");
      expect(response.body.name).toBe("ValidationError");
      expect(response.body.path).toBe("email");
      expect(response.body.type).toBe("required");
      expect(response.statusText).toBe("Bad Request");
    });

    it("should throw invalid email error", async () => {
      const userId = await createUser(admin);
      const token = await generateAccessToken(userId);
      const invalidUser = { ...user };
      invalidUser.email = "invalidemail";

      const request = await superoak(app);
      const response = await request.post("/api/users")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send(invalidUser)
        .expect(400);

      const dbUsers = await User.find({ email: invalidUser.email }).toArray();
      expect(response.status).toBe(400);
      expect(dbUsers.length).toBe(0);
      expect(response.body.message).toBe("email must be a valid email");
      expect(response.body.name).toBe("ValidationError");
      expect(response.body.path).toBe("email");
      expect(response.body.type).toBe("email");
      expect(response.statusText).toBe("Bad Request");
    });

    it("should throw missing password error", async () => {
      const userId = await createUser(admin);
      const token = await generateAccessToken(userId);
      const invalidUser = { ...user };
      invalidUser.password = "";

      const request = await superoak(app);
      const response = await request.post("/api/users")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send(invalidUser)
        .expect(400);

      const dbUsers = await User.find({ email: invalidUser.email }).toArray();
      expect(response.status).toBe(400);
      expect(dbUsers.length).toBe(0);
      expect(response.body.message).toBe("password is a required field");
      expect(response.body.name).toBe("ValidationError");
      expect(response.body.path).toBe("password");
      expect(response.body.type).toBe("required");
      expect(response.statusText).toBe("Bad Request");
    });

    it("should throw max password error", async () => {
      const userId = await createUser(admin);
      const token = await generateAccessToken(userId);
      const invalidUser = { ...user };
      invalidUser.password =
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry" +
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry" +
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry" +
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry" +
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry" +
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry" +
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry" +
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry" +
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry";

      const request = await superoak(app);
      const response = await request.post("/api/users")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send(invalidUser)
        .expect(400);

      const dbUsers = await User.find({ email: invalidUser.email }).toArray();
      expect(response.status).toBe(400);
      expect(dbUsers.length).toBe(0);
      expect(response.body.message).toBe(
        "password must be at most 255 characters",
      );
      expect(response.body.name).toBe("ValidationError");
      expect(response.body.path).toBe("password");
      expect(response.body.type).toBe("max");
      expect(response.statusText).toBe("Bad Request");
    });

    it("should throw invalid password error", async () => {
      const userId = await createUser(admin);
      const token = await generateAccessToken(userId);
      const invalidUser = { ...user };
      invalidUser.password = "1";

      const request = await superoak(app);
      const response = await request.post("/api/users")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send(invalidUser)
        .expect(400);

      const dbUsers = await User.find({ email: invalidUser.email }).toArray();
      expect(response.status).toBe(400);
      expect(dbUsers.length).toBe(0);
      expect(response.body.message).toBe(
        "password must be at least 6 characters",
      );
      expect(response.body.name).toBe("ValidationError");
      expect(response.body.path).toBe("password");
      expect(response.body.type).toBe("min");
      expect(response.statusText).toBe("Bad Request");
    });

    it("should throw invalid role error", async () => {
      const userId = await createUser(admin);
      const token = await generateAccessToken(userId);
      const invalidUser = { ...user };
      invalidUser.role = "1";

      const request = await superoak(app);
      const response = await request.post("/api/users")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send(invalidUser)
        .expect(400);

      const dbUsers = await User.find({ email: invalidUser.email }).toArray();
      expect(response.status).toBe(400);
      expect(dbUsers.length).toBe(0);
      expect(response.body.message).toBe(
        `role must be one of the following values: ${roles.join(", ")}`,
      );
      expect(response.body.name).toBe("ValidationError");
      expect(response.body.path).toBe("role");
      expect(response.body.type).toBe("oneOf");
      expect(response.statusText).toBe("Bad Request");
    });

    it("should not create user if no admin rights", async () => {
      const userId = await createUser(user);
      const token = await generateAccessToken(userId);

      const request = await superoak(app);
      const response = await request.post("/api/users")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send(user2)
        .expect(403);

      const dbUsers = await User.find({ email: user2.email }).toArray();
      expect(response.status).toBe(403);
      expect(dbUsers.length).toBe(0);
      expect(response.body.message).toBe("Insufficient rights");
      expect(response.body.name).toBe("Forbidden");
      expect(response.body.path).toBe("access_token");
      expect(response.body.type).toBe("Forbidden");
      expect(response.statusText).toBe("Forbidden");
    });
  });
});
