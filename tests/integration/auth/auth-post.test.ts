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
import { clearCollection, createUser } from "../../utils/utils.ts";
import { user } from "../../fixtures/users.fixtures.ts";
import { User } from "../../../models/user.model.ts";

describe("Auth endpoints POST", () => {
  beforeEach(async () => {
    await clearCollection("users");
    await clearCollection("tokens");
  });

  afterAll(async () => {
    await clearCollection("users");
    await clearCollection("tokens");
  });

  describe("POST /auth/login", () => {
    it("should login", async () => {
      const userId = await createUser(user);
      const { email, password } = user;

      const request = await superoak(app);
      const response = await request.post("/api/auth/login")
        .set("Content-Type", "application/json")
        .send({ email, password })
        .expect(200);
      const dbUser = await User.findOne(
        { _id: new Bson.ObjectId(userId) },
      );
      expect(typeof response.body).toBe("object");
      expect(response.status).toBe(200);
      expect(response.body.tokens).toBeDefined();
      expect(response.body.tokens.access).toBeDefined();
      expect(response.body.tokens.access.token).toBeDefined();
      expect(typeof response.body.tokens.access.token).toBe("string");
      expect(response.body.tokens.access.expires).toBeDefined();
      expect(typeof response.body.tokens.access.expires).toBe("string");
      expect(response.body.tokens.refresh).toBeDefined();
      expect(response.body.tokens.refresh.token).toBeDefined();
      expect(typeof response.body.tokens.refresh.token).toBe("string");
      expect(response.body.tokens.refresh.expires).toBeDefined();
      expect(typeof response.body.tokens.refresh.expires).toBe("string");
      expect(response.body.user).toBeDefined();
      expect(response.body.user.id).toBe(userId);
      expect(response.body.user.name).toBe(dbUser?.name);
      expect(response.body.user.email).toBe(dbUser?.email);
      expect(response.body.user.role).toBe(dbUser?.role);
      expect(response.body.user.isDisabled).toBe(dbUser?.isDisabled);
    });

    it("should get new access token", async () => {
      await createUser(user);
      const { email, password } = user;

      const loginRequest = await superoak(app);

      const loginResponse = await loginRequest.post("/api/auth/login")
        .set("Content-Type", "application/json")
        .send({ email, password })
        .expect(200);

      const request = await superoak(app);

      const response = await request.post("/api/auth/refresh-tokens")
        .set("Content-Type", "application/json")
        .set(
          "Authorization",
          `Bearer ${loginResponse.body.tokens.access.token}`,
        )
        .send({ refreshToken: loginResponse.body.tokens.refresh.token })
        .expect(200);
      expect(typeof response.body).toBe("object");
      expect(response.status).toBe(200);
      expect(response.body.tokens).toBeDefined();
      expect(response.body.tokens.access).toBeDefined();
      expect(response.body.tokens.access.token).toBeDefined();
      expect(typeof response.body.tokens.access.token).toBe("string");
      expect(response.body.tokens.access.expires).toBeDefined();
      expect(typeof response.body.tokens.access.expires).toBe("string");
      expect(response.body.tokens.refresh).toBeDefined();
      expect(response.body.tokens.refresh.token).toBeDefined();
      expect(typeof response.body.tokens.refresh.token).toBe("string");
      expect(response.body.tokens.refresh.expires).toBeDefined();
      expect(typeof response.body.tokens.refresh.expires).toBe("string");
    });
  });
});
