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

describe("Users endpoints PUT", () => {
  beforeEach(async () => {
    await clearCollection("users");
  });

  afterAll(async () => {
    await clearCollection("users");
  });

  describe("PUT users/", () => {
    it("should allow admin to update user name", async () => {
      const adminId = await createUser(admin);
      const userId = await createUser(user);
      const token = await generateAccessToken(adminId);
      const updateData = {
        name: "new name",
      };

      const request = await superoak(app);
      const response = await request.put(`/api/users/${userId}`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send(updateData)
        .expect(200);
      const dbUser = await User.findOne(
        { _id: new Bson.ObjectId(response.body) },
      );
      expect(typeof response.body).toBe("object");
      expect(response.status).toBe(200);
      expect(response.body.name).toBe(updateData.name);
      expect(response.body.email).toBe(user.email);
      expect(response.body.role).toBe(user.role);
      expect(response.body.isDisabled).toBe(user.isDisabled);
      expect(response.body.createdAt).toBeDefined();
      expect(response.body.updatedAt).toBeDefined();
      expect(dbUser?.name).toBe(updateData.name);
      expect(dbUser?.email).toBe(user.email);
      expect(dbUser?.role).toBe(user.role);
      expect(dbUser?.isDisabled).toBe(user.isDisabled);
      expect(dbUser?.docVersion).toBe(2);
      expect(dbUser?.createdAt).toBeDefined();
      expect(dbUser?.updatedAt).toBeDefined();
    });

    it("should allow admin to update user email", async () => {
      const adminId = await createUser(admin);
      const userId = await createUser(user);
      const token = await generateAccessToken(adminId);
      const updateData = {
        email: "email@somedomain.com",
      };

      const request = await superoak(app);
      const response = await request.put(`/api/users/${userId}`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send(updateData)
        .expect(200);
      const dbUser = await User.findOne(
        { _id: new Bson.ObjectId(response.body) },
      );
      expect(typeof response.body).toBe("object");
      expect(response.status).toBe(200);
      expect(response.body.name).toBe(user.name);
      expect(response.body.email).toBe(updateData.email);
      expect(response.body.role).toBe(user.role);
      expect(response.body.isDisabled).toBe(user.isDisabled);
      expect(response.body.createdAt).toBeDefined();
      expect(response.body.updatedAt).toBeDefined();
      expect(dbUser?.name).toBe(user.name);
      expect(dbUser?.email).toBe(updateData.email);
      expect(dbUser?.role).toBe(user.role);
      expect(dbUser?.isDisabled).toBe(user.isDisabled);
      expect(dbUser?.docVersion).toBe(2);
      expect(dbUser?.createdAt).toBeDefined();
      expect(dbUser?.updatedAt).toBeDefined();
    });

    it("should allow user to update user email", async () => {
      const userId = await createUser(user);
      const token = await generateAccessToken(userId);
      const updateData = {
        email: "email@somedomain.com",
      };

      const request = await superoak(app);
      const response = await request.put(`/api/users/${userId}`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send(updateData)
        .expect(200);
      const dbUser = await User.findOne(
        { _id: new Bson.ObjectId(userId) },
      );
      expect(typeof response.body).toBe("object");
      expect(response.status).toBe(200);
      expect(response.body.name).toBe(user.name);
      expect(response.body.email).toBe(updateData.email);
      expect(response.body.role).toBe(user.role);
      expect(response.body.isDisabled).toBe(user.isDisabled);
      expect(response.body.createdAt).toBeDefined();
      expect(response.body.updatedAt).toBeDefined();
      expect(dbUser?.name).toBe(user.name);
      expect(dbUser?.email).toBe(updateData.email);
      expect(dbUser?.role).toBe(user.role);
      expect(dbUser?.isDisabled).toBe(user.isDisabled);
      expect(dbUser?.docVersion).toBe(2);
      expect(dbUser?.createdAt).toBeDefined();
      expect(dbUser?.updatedAt).toBeDefined();
    });

    it("should update user role", async () => {
      const adminId = await createUser(admin);
      const userId = await createUser(user);
      const token = await generateAccessToken(adminId);
      const updateData = {
        role: roles[0],
      };

      const request = await superoak(app);
      const response = await request.put(`/api/users/${userId}`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send(updateData)
        .expect(200);
      const dbUser = await User.findOne(
        { _id: new Bson.ObjectId(response.body) },
      );
      expect(typeof response.body).toBe("object");
      expect(response.status).toBe(200);
      expect(response.body.name).toBe(user.name);
      expect(response.body.email).toBe(user.email);
      expect(response.body.role).toBe(updateData.role);
      expect(response.body.isDisabled).toBe(user.isDisabled);
      expect(response.body.createdAt).toBeDefined();
      expect(response.body.updatedAt).toBeDefined();
      expect(dbUser?.name).toBe(user.name);
      expect(dbUser?.email).toBe(user.email);
      expect(dbUser?.role).toBe(updateData.role);
      expect(dbUser?.isDisabled).toBe(user.isDisabled);
      expect(dbUser?.docVersion).toBe(2);
      expect(dbUser?.createdAt).toBeDefined();
      expect(dbUser?.updatedAt).toBeDefined();
    });

    it("should allow admin to update isDisabled for other users", async () => {
      const adminId = await createUser(admin);
      const userId = await createUser(user);
      const token = await generateAccessToken(adminId);
      const updateData = {
        isDisabled: true,
      };

      const request = await superoak(app);
      const response = await request.put(`/api/users/${userId}`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send(updateData)
        .expect(200);
      const dbUser = await User.findOne(
        { _id: new Bson.ObjectId(response.body) },
      );
      expect(typeof response.body).toBe("object");
      expect(response.status).toBe(200);
      expect(response.body.name).toBe(user.name);
      expect(response.body.email).toBe(user.email);
      expect(response.body.role).toBe(user.role);
      expect(response.body.isDisabled).toBe(updateData.isDisabled);
      expect(response.body.createdAt).toBeDefined();
      expect(response.body.updatedAt).toBeDefined();
      expect(dbUser?.name).toBe(user.name);
      expect(dbUser?.email).toBe(user.email);
      expect(dbUser?.role).toBe(user.role);
      expect(dbUser?.isDisabled).toBe(updateData.isDisabled);
      expect(dbUser?.docVersion).toBe(2);
      expect(dbUser?.createdAt).toBeDefined();
      expect(dbUser?.updatedAt).toBeDefined();
    });

    it("should allow admin to update isDisabled for self", async () => {
      const adminId = await createUser(admin);
      const token = await generateAccessToken(adminId);
      const updateData = {
        isDisabled: true,
      };

      const request = await superoak(app);
      const response = await request.put(`/api/users/${adminId}`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send(updateData)
        .expect(200);
      const dbUser = await User.findOne(
        { _id: new Bson.ObjectId(response.body) },
      );
      expect(typeof response.body).toBe("object");
      expect(response.status).toBe(200);
      expect(response.body.name).toBe(admin.name);
      expect(response.body.email).toBe(admin.email);
      expect(response.body.role).toBe(admin.role);
      expect(response.body.isDisabled).toBe(updateData.isDisabled);
      expect(response.body.createdAt).toBeDefined();
      expect(response.body.updatedAt).toBeDefined();
      expect(dbUser?.name).toBe(admin.name);
      expect(dbUser?.email).toBe(admin.email);
      expect(dbUser?.role).toBe(admin.role);
      expect(dbUser?.isDisabled).toBe(updateData.isDisabled);
      expect(dbUser?.docVersion).toBe(2);
      expect(dbUser?.createdAt).toBeDefined();
      expect(dbUser?.updatedAt).toBeDefined();
    });

    it("should not allow users to update isDisabled for others", async () => {
      const userId = await createUser(user);
      const user2Id = await createUser(user2);
      const token = await generateAccessToken(userId);
      const updateData = {
        isDisabled: true,
      };

      const request = await superoak(app);
      const response = await request.put(`/api/users/${user2Id}`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send(updateData)
        .expect(403);
      const dbUser = await User.findOne(
        { _id: new Bson.ObjectId(user2Id) },
      );
      expect(typeof response.body).toBe("object");
      expect(response.status).toBe(403);
      expect(response.body.message).toBe("Insufficient rights");
      expect(response.body.name).toBe("Forbidden");
      expect(response.body.path).toBe("access_token");
      expect(response.body.type).toBe("Forbidden");
      expect(response.statusText).toBe("Forbidden");
      expect(dbUser?.name).toBe(user2.name);
      expect(dbUser?.email).toBe(user2.email);
      expect(dbUser?.role).toBe(user2.role);
      expect(dbUser?.isDisabled).toBe(user2.isDisabled);
      expect(dbUser?.docVersion).toBe(1);
      expect(dbUser?.createdAt).toBeDefined();
      expect(dbUser?.updatedAt).toBeUndefined();
    });

    it("should allow users to update isDisabled for self", async () => {
      const userId = await createUser(user);
      const token = await generateAccessToken(userId);
      const updateData = {
        isDisabled: true,
      };

      const request = await superoak(app);
      const response = await request.put(`/api/users/${userId}`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send(updateData)
        .expect(200);
      const dbUser = await User.findOne(
        { _id: new Bson.ObjectId(userId) },
      );
      expect(typeof response.body).toBe("object");
      expect(response.status).toBe(200);
      expect(response.body.name).toBe(user.name);
      expect(response.body.email).toBe(user.email);
      expect(response.body.role).toBe(user.role);
      expect(response.body.isDisabled).toBe(updateData.isDisabled);
      expect(response.body.createdAt).toBeDefined();
      expect(response.body.updatedAt).toBeDefined();
      expect(dbUser?.name).toBe(user.name);
      expect(dbUser?.email).toBe(user.email);
      expect(dbUser?.role).toBe(user.role);
      expect(dbUser?.isDisabled).toBe(updateData.isDisabled);
      expect(dbUser?.docVersion).toBe(2);
      expect(dbUser?.createdAt).toBeDefined();
      expect(dbUser?.updatedAt).toBeDefined();
    });

    it("should be able to self update with userid param", async () => {
      const userId = await createUser(user);
      const token = await generateAccessToken(userId);
      const updateData = {
        name: "new name",
      };

      const request = await superoak(app);
      const response = await request.put(`/api/users/${userId}`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send(updateData)
        .expect(200);
      const dbUser = await User.findOne(
        { _id: new Bson.ObjectId(userId) },
      );
      expect(typeof response.body).toBe("object");
      expect(response.status).toBe(200);
      expect(response.body.name).toBe(updateData.name);
      expect(response.body.email).toBe(user.email);
      expect(response.body.role).toBe(user.role);
      expect(response.body.isDisabled).toBe(user.isDisabled);
      expect(response.body.createdAt).toBeDefined();
      expect(response.body.updatedAt).toBeDefined();
      expect(dbUser?.name).toBe(updateData.name);
      expect(dbUser?.email).toBe(user.email);
      expect(dbUser?.role).toBe(user.role);
      expect(dbUser?.isDisabled).toBe(user.isDisabled);
      expect(dbUser?.docVersion).toBe(2);
      expect(dbUser?.createdAt).toBeDefined();
      expect(dbUser?.updatedAt).toBeDefined();
    });

    it("should be able to self update with admin rights", async () => {
      const adminId = await createUser(admin);
      const token = await generateAccessToken(adminId);
      const updateData = {
        name: "new name",
      };

      const request = await superoak(app);
      const response = await request.put(`/api/users/${adminId}`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send(updateData)
        .expect(200);
      const dbUser = await User.findOne(
        { _id: new Bson.ObjectId(adminId) },
      );
      expect(typeof response.body).toBe("object");
      expect(response.status).toBe(200);
      expect(response.body.name).toBe(updateData.name);
      expect(response.body.email).toBe(admin.email);
      expect(response.body.role).toBe(admin.role);
      expect(response.body.isDisabled).toBe(admin.isDisabled);
      expect(response.body.createdAt).toBeDefined();
      expect(response.body.updatedAt).toBeDefined();
      expect(dbUser?.name).toBe(updateData.name);
      expect(dbUser?.email).toBe(admin.email);
      expect(dbUser?.role).toBe(admin.role);
      expect(dbUser?.isDisabled).toBe(admin.isDisabled);
      expect(dbUser?.docVersion).toBe(2);
      expect(dbUser?.createdAt).toBeDefined();
      expect(dbUser?.updatedAt).toBeDefined();
    });

    it("should not be able to update admin with user rights", async () => {
      const adminId = await createUser(admin);
      const userId = await createUser(user);
      const token = await generateAccessToken(userId);
      const updateData = {
        name: "new name",
      };

      const request = await superoak(app);
      const response = await request.put(`/api/users/${adminId}`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send(updateData)
        .expect(403);
      const dbUser = await User.findOne(
        { _id: new Bson.ObjectId(adminId) },
      );
      expect(typeof response.body).toBe("object");
      expect(response.status).toBe(403);
      expect(response.body.message).toBe("Insufficient rights");
      expect(response.body.name).toBe("Forbidden");
      expect(response.body.path).toBe("access_token");
      expect(response.body.type).toBe("Forbidden");
      expect(response.statusText).toBe("Forbidden");
      expect(dbUser?.name).toBe(admin.name);
      expect(dbUser?.email).toBe(admin.email);
      expect(dbUser?.role).toBe(admin.role);
      expect(dbUser?.isDisabled).toBe(admin.isDisabled);
      expect(dbUser?.docVersion).toBe(1);
      expect(dbUser?.createdAt).toBeDefined();
      expect(dbUser?.updatedAt).toBeUndefined();
    });

    it("should not be able to update other user with user rights", async () => {
      const userId = await createUser(user);
      const user2Id = await createUser(user2);
      const token = await generateAccessToken(userId);
      const updateData = {
        name: "new name",
      };

      const request = await superoak(app);
      const response = await request.put(`/api/users/${user2Id}`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send(updateData)
        .expect(403);
      const dbUser = await User.findOne(
        { _id: new Bson.ObjectId(user2Id) },
      );
      expect(typeof response.body).toBe("object");
      expect(response.status).toBe(403);
      expect(response.body.message).toBe("Insufficient rights");
      expect(response.body.name).toBe("Forbidden");
      expect(response.body.path).toBe("access_token");
      expect(response.body.type).toBe("Forbidden");
      expect(response.statusText).toBe("Forbidden");
      expect(dbUser?.name).toBe(user2.name);
      expect(dbUser?.email).toBe(user2.email);
      expect(dbUser?.role).toBe(user2.role);
      expect(dbUser?.isDisabled).toBe(user2.isDisabled);
      expect(dbUser?.docVersion).toBe(1);
      expect(dbUser?.createdAt).toBeDefined();
      expect(dbUser?.updatedAt).toBeUndefined();
    });

    it("should restrict users from changing their roles", async () => {
      const userId = await createUser(user);
      const token = await generateAccessToken(userId);
      const updateData = {
        role: "admin",
      };

      const request = await superoak(app);
      const response = await request.put(`/api/users/${userId}`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send(updateData)
        .expect(403);
      const dbUser = await User.findOne(
        { _id: new Bson.ObjectId(userId) },
      );
      expect(typeof response.body).toBe("object");
      expect(response.status).toBe(403);
      expect(response.body.message).toBe("Cannot change role to higher");
      expect(response.body.name).toBe("Forbidden");
      expect(response.body.path).toBe("access_token");
      expect(response.body.type).toBe("Forbidden");
      expect(response.statusText).toBe("Forbidden");
      expect(dbUser?.name).toBe(user.name);
      expect(dbUser?.email).toBe(user.email);
      expect(dbUser?.role).toBe(user.role);
      expect(dbUser?.isDisabled).toBe(user.isDisabled);
      expect(dbUser?.docVersion).toBe(1);
      expect(dbUser?.createdAt).toBeDefined();
      expect(dbUser?.updatedAt).toBeUndefined();
    });

    it("should restrict users from changing other's roles", async () => {
      const userId = await createUser(user);
      const user2Id = await createUser(user2);
      const token = await generateAccessToken(userId);
      const updateData = {
        role: "admin",
      };

      const request = await superoak(app);
      const response = await request.put(`/api/users/${user2Id}`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send(updateData)
        .expect(403);
      const dbUser = await User.findOne(
        { _id: new Bson.ObjectId(user2Id) },
      );
      expect(typeof response.body).toBe("object");
      expect(response.status).toBe(403);
      expect(response.body.message).toBe("Insufficient rights");
      expect(response.body.name).toBe("Forbidden");
      expect(response.body.path).toBe("access_token");
      expect(response.body.type).toBe("Forbidden");
      expect(response.statusText).toBe("Forbidden");
      expect(dbUser?.name).toBe(user2.name);
      expect(dbUser?.email).toBe(user2.email);
      expect(dbUser?.role).toBe(user2.role);
      expect(dbUser?.isDisabled).toBe(user2.isDisabled);
      expect(dbUser?.docVersion).toBe(1);
      expect(dbUser?.createdAt).toBeDefined();
      expect(dbUser?.updatedAt).toBeUndefined();
    });

    it("should allow admin to change other's roles", async () => {
      const adminId = await createUser(admin);
      const userId = await createUser(user);
      const token = await generateAccessToken(adminId);
      const updateData = {
        role: "admin",
      };

      const request = await superoak(app);
      const response = await request.put(`/api/users/${userId}`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send(updateData)
        .expect(200);
      const dbUser = await User.findOne(
        { _id: new Bson.ObjectId(userId) },
      );
      expect(typeof response.body).toBe("object");
      expect(response.status).toBe(200);
      expect(response.body.name).toBe(user.name);
      expect(response.body.email).toBe(user.email);
      expect(response.body.role).toBe(updateData.role);
      expect(response.body.isDisabled).toBe(user.isDisabled);
      expect(response.body.createdAt).toBeDefined();
      expect(response.body.updatedAt).toBeDefined();
      expect(dbUser?.name).toBe(user.name);
      expect(dbUser?.email).toBe(user.email);
      expect(dbUser?.role).toBe(updateData.role);
      expect(dbUser?.isDisabled).toBe(user.isDisabled);
      expect(dbUser?.docVersion).toBe(2);
      expect(dbUser?.createdAt).toBeDefined();
      expect(dbUser?.updatedAt).toBeDefined();
    });

    it("should allow admin to change self role", async () => {
      const adminId = await createUser(admin);
      const token = await generateAccessToken(adminId);
      const updateData = {
        role: "user",
      };

      const request = await superoak(app);
      const response = await request.put(`/api/users/${adminId}`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send(updateData)
        .expect(200);
      const dbUser = await User.findOne(
        { _id: new Bson.ObjectId(adminId) },
      );
      expect(typeof response.body).toBe("object");
      expect(response.status).toBe(200);
      expect(response.body.name).toBe(admin.name);
      expect(response.body.email).toBe(admin.email);
      expect(response.body.role).toBe(updateData.role);
      expect(response.body.isDisabled).toBe(admin.isDisabled);
      expect(response.body.createdAt).toBeDefined();
      expect(response.body.updatedAt).toBeDefined();
      expect(dbUser?.name).toBe(admin.name);
      expect(dbUser?.email).toBe(admin.email);
      expect(dbUser?.role).toBe(updateData.role);
      expect(dbUser?.isDisabled).toBe(admin.isDisabled);
      expect(dbUser?.docVersion).toBe(2);
      expect(dbUser?.createdAt).toBeDefined();
      expect(dbUser?.updatedAt).toBeDefined();
    });

    it("should not allow admin to change self role to superAdmin", async () => {
      const adminId = await createUser(admin);
      const token = await generateAccessToken(adminId);
      const updateData = {
        role: "superAdmin",
      };

      const request = await superoak(app);
      const response = await request.put(`/api/users/${adminId}`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send(updateData)
        .expect(403);
      const dbUser = await User.findOne(
        { _id: new Bson.ObjectId(adminId) },
      );
      expect(typeof response.body).toBe("object");
      expect(response.status).toBe(403);
      expect(response.body.message).toBe("Cannot change role to higher");
      expect(response.body.name).toBe("Forbidden");
      expect(response.body.path).toBe("access_token");
      expect(response.body.type).toBe("Forbidden");
      expect(response.statusText).toBe("Forbidden");
      expect(dbUser?.name).toBe(admin.name);
      expect(dbUser?.email).toBe(admin.email);
      expect(dbUser?.role).toBe(admin.role);
      expect(dbUser?.isDisabled).toBe(admin.isDisabled);
      expect(dbUser?.docVersion).toBe(1);
      expect(dbUser?.createdAt).toBeDefined();
      expect(dbUser?.updatedAt).toBeUndefined();
    });

    it("should allow admin to change self role to user", async () => {
      const adminId = await createUser(admin);
      const token = await generateAccessToken(adminId);
      const updateData = {
        role: "user",
      };

      const request = await superoak(app);
      const response = await request.put(`/api/users/${adminId}`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send(updateData)
        .expect(200);
      const dbUser = await User.findOne(
        { _id: new Bson.ObjectId(adminId) },
      );
      expect(response.status).toBe(200);
      expect(typeof response.body).toBe("object");
      expect(response.body.name).toBe(admin.name);
      expect(response.body.email).toBe(admin.email);
      expect(response.body.role).toBe(updateData.role);
      expect(response.body.isDisabled).toBe(admin.isDisabled);
      expect(response.body.createdAt).toBeDefined();
      expect(response.body.updatedAt).toBeDefined();
      expect(dbUser?.name).toBe(admin.name);
      expect(dbUser?.email).toBe(admin.email);
      expect(dbUser?.role).toBe(updateData.role);
      expect(dbUser?.isDisabled).toBe(admin.isDisabled);
      expect(dbUser?.docVersion).toBe(2);
      expect(dbUser?.createdAt).toBeDefined();
      expect(dbUser?.updatedAt).toBeDefined();
    });
  });
});
