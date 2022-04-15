import {
  afterAll,
  beforeEach,
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
import { admin, user, user2 } from "../../fixtures/users.fixtures.ts";

describe("Users endpoints GET", () => {
  beforeEach(async () => {
    await clearCollection("users");
  });

  afterAll(async () => {
    await clearCollection("users");
  });

  describe("GET users/", () => {
    it("should return array of users", async () => {
      const userId = await createUser(admin);
      await createUser(user);
      await createUser(user2);
      const token = await generateAccessToken(userId);

      const request = await superoak(app);
      const response = await request.get("/api/users")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);
      expect(typeof response.body).toBe("object");
      expect(response.status).toBe(200);
      expect(response.body.length).toBe(3);
    });

    it("should not allow any query string", async () => {
      const userId = await createUser(admin);
      const token = await generateAccessToken(userId);

      const request = await superoak(app);
      const response = await request.get("/api/users?query=something")
        .set("Authorization", `Bearer ${token}`)
        .expect(400);
      expect(typeof response.body).toBe("object");
      expect(response.status).toBe(400);
      expect(response.body.message).toBe("query is not allowed");
      expect(response.body.name).toBe("ValidationError");
      expect(response.body.path).toBe("query");
      expect(response.body.type).toBe("BadRequest");
      expect(response.statusText).toBe("Bad Request");
    });
  });
});
