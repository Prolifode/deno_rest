import { Bson, superoak } from "../../deps.ts";
import { expect } from "https://deno.land/x/expect/mod.ts";
import { app } from "../../app.ts";
import {
  clearCollection,
  createUser,
  generateAccessToken,
} from "../utils/utils.ts";
import { User } from "../../models/user.model.ts";

Deno.test("it should create user", async () => {
  await clearCollection("users");
  const admin = {
    "name": "Admin User",
    "email": "admin@test.com",
    "password": "123456",
    "role": "admin",
    "isDisabled": false,
  };

  const user = {
    "name": "Test User",
    "email": "test@test.com",
    "password": "123456",
    "role": "admin",
    "isDisabled": false,
  };

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
  await clearCollection("users");
});
