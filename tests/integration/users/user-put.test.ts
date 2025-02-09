import { afterAll, beforeEach, describe, it } from 'jsr:@std/testing/bdd';
import { expect } from '@std/expect';
import {
  clearCollection,
  createUser,
  generateAccessToken,
  withTestServer,
} from '../../utils/utils.ts';
import { admin, user, user2 } from '../../fixtures/users.fixtures.ts';
import { Role, ROLES_RANK } from '../../../config/roles.ts';

describe('Users endpoints PUT', () => {
  beforeEach(async () => {
    await clearCollection('users');
  });

  afterAll(async () => {
    await clearCollection('users');
  });

  describe('PUT /users/', () => {
    it('should allow admin to update user name', async () => {
      await withTestServer(async (port) => {
        const adminId = await createUser(admin);
        const userId = await createUser(user);
        const token = await generateAccessToken(adminId);
        const updateData = { name: 'new name' };

        const response = await fetch(
          `http://localhost:${port}/api/users/${userId}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(updateData),
          },
        );
        expect(response.status).toBe(200);
        const responseBody = await response.json();
        expect(typeof responseBody).toBe('object');
        expect(responseBody.name).toBe(updateData.name);
        expect(responseBody.email).toBe(user.email);
        expect(responseBody.role).toBe(user.role);
        expect(responseBody.isDisabled).toBe(user.isDisabled);
        expect(responseBody.createdAt).toBeDefined();
        expect(responseBody.updatedAt).toBeDefined();
      });
    });

    it('should allow admin to update user email', async () => {
      await withTestServer(async (port) => {
        const adminId = await createUser(admin);
        const userId = await createUser(user);
        const token = await generateAccessToken(adminId);
        const updateData = { email: 'email@somedomain.com' };

        const response = await fetch(
          `http://localhost:${port}/api/users/${userId}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(updateData),
          },
        );
        expect(response.status).toBe(200);
        const responseBody = await response.json();
        expect(typeof responseBody).toBe('object');
        expect(responseBody.name).toBe(user.name);
        expect(responseBody.email).toBe(updateData.email);
        expect(responseBody.role).toBe(user.role);
        expect(responseBody.isDisabled).toBe(user.isDisabled);
        expect(responseBody.createdAt).toBeDefined();
        expect(responseBody.updatedAt).toBeDefined();
      });
    });

    it('should allow user to update user email', async () => {
      await withTestServer(async (port) => {
        const userId = await createUser(user);
        const token = await generateAccessToken(userId);
        const updateData = { email: 'email@somedomain.com' };

        const response = await fetch(
          `http://localhost:${port}/api/users/${userId}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(updateData),
          },
        );
        expect(response.status).toBe(200);
        const responseBody = await response.json();
        expect(typeof responseBody).toBe('object');
        expect(responseBody.name).toBe(user.name);
        expect(responseBody.email).toBe(updateData.email);
        expect(responseBody.role).toBe(user.role);
        expect(responseBody.isDisabled).toBe(user.isDisabled);
        expect(responseBody.createdAt).toBeDefined();
        expect(responseBody.updatedAt).toBeDefined();
      });
    });

    it('should update user role', async () => {
      await withTestServer(async (port) => {
        const adminId = await createUser(admin);
        const userId = await createUser(user);
        const token = await generateAccessToken(adminId);
        const updateData = { role: ROLES_RANK[0] };

        const response = await fetch(
          `http://localhost:${port}/api/users/${userId}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(updateData),
          },
        );
        expect(response.status).toBe(200);
        const responseBody = await response.json();
        expect(typeof responseBody).toBe('object');
        expect(responseBody.name).toBe(user.name);
        expect(responseBody.email).toBe(user.email);
        expect(responseBody.role).toBe(updateData.role);
        expect(responseBody.isDisabled).toBe(user.isDisabled);
        expect(responseBody.createdAt).toBeDefined();
        expect(responseBody.updatedAt).toBeDefined();
      });
    });

    it('should allow admin to update isDisabled for other users', async () => {
      await withTestServer(async (port) => {
        const adminId = await createUser(admin);
        const userId = await createUser(user);
        const token = await generateAccessToken(adminId);
        const updateData = { isDisabled: true };

        const response = await fetch(
          `http://localhost:${port}/api/users/${userId}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(updateData),
          },
        );
        expect(response.status).toBe(200);
        const responseBody = await response.json();
        expect(typeof responseBody).toBe('object');
        expect(responseBody.name).toBe(user.name);
        expect(responseBody.email).toBe(user.email);
        expect(responseBody.role).toBe(user.role);
        expect(responseBody.isDisabled).toBe(updateData.isDisabled);
        expect(responseBody.createdAt).toBeDefined();
        expect(responseBody.updatedAt).toBeDefined();
      });
    });

    it('should allow admin to update isDisabled for self', async () => {
      await withTestServer(async (port) => {
        const adminId = await createUser(admin);
        const token = await generateAccessToken(adminId);
        const updateData = { isDisabled: true };

        const response = await fetch(
          `http://localhost:${port}/api/users/${adminId}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(updateData),
          },
        );
        expect(response.status).toBe(200);
        const responseBody = await response.json();
        expect(typeof responseBody).toBe('object');
        expect(responseBody.name).toBe(admin.name);
        expect(responseBody.email).toBe(admin.email);
        expect(responseBody.role).toBe(admin.role);
        expect(responseBody.isDisabled).toBe(updateData.isDisabled);
        expect(responseBody.createdAt).toBeDefined();
        expect(responseBody.updatedAt).toBeDefined();
      });
    });

    it('should not allow users to update isDisabled for others', async () => {
      await withTestServer(async (port) => {
        const userId = await createUser(user);
        const user2Id = await createUser(user2);
        const token = await generateAccessToken(userId);
        const updateData = { isDisabled: true };

        const response = await fetch(
          `http://localhost:${port}/api/users/${user2Id}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(updateData),
          },
        );
        expect(response.status).toBe(403);
        const responseBody = await response.json();
        expect(typeof responseBody).toBe('object');
        expect(responseBody.message).toBe('Insufficient rights');
        expect(responseBody.name).toBe('Forbidden');
        expect(responseBody.path).toBe('access_token');
        expect(responseBody.type).toBe('Forbidden');
      });
    });

    it('should allow users to update isDisabled for self', async () => {
      await withTestServer(async (port) => {
        const userId = await createUser(user);
        const token = await generateAccessToken(userId);
        const updateData = { isDisabled: true };

        const response = await fetch(
          `http://localhost:${port}/api/users/${userId}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(updateData),
          },
        );
        expect(response.status).toBe(200);
        const responseBody = await response.json();
        expect(typeof responseBody).toBe('object');
        expect(responseBody.name).toBe(user.name);
        expect(responseBody.email).toBe(user.email);
        expect(responseBody.role).toBe(user.role);
        expect(responseBody.isDisabled).toBe(updateData.isDisabled);
        expect(responseBody.createdAt).toBeDefined();
        expect(responseBody.updatedAt).toBeDefined();
      });
    });

    it('should be able to self update with userid param', async () => {
      await withTestServer(async (port) => {
        const userId = await createUser(user);
        const token = await generateAccessToken(userId);
        const updateData = { name: 'new name' };

        const response = await fetch(
          `http://localhost:${port}/api/users/${userId}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(updateData),
          },
        );
        expect(response.status).toBe(200);
        const responseBody = await response.json();
        expect(typeof responseBody).toBe('object');
        expect(responseBody.name).toBe(updateData.name);
        expect(responseBody.email).toBe(user.email);
        expect(responseBody.role).toBe(user.role);
        expect(responseBody.isDisabled).toBe(user.isDisabled);
        expect(responseBody.createdAt).toBeDefined();
        expect(responseBody.updatedAt).toBeDefined();
      });
    });

    it('should be able to self update with admin rights', async () => {
      await withTestServer(async (port) => {
        const adminId = await createUser(admin);
        const token = await generateAccessToken(adminId);
        const updateData = { name: 'new name' };

        const response = await fetch(
          `http://localhost:${port}/api/users/${adminId}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(updateData),
          },
        );
        expect(response.status).toBe(200);
        const responseBody = await response.json();
        expect(typeof responseBody).toBe('object');
        expect(responseBody.name).toBe(updateData.name);
        expect(responseBody.email).toBe(admin.email);
        expect(responseBody.role).toBe(admin.role);
        expect(responseBody.isDisabled).toBe(admin.isDisabled);
        expect(responseBody.createdAt).toBeDefined();
        expect(responseBody.updatedAt).toBeDefined();
      });
    });

    it('should not allow admin to change self role to superAdmin', async () => {
      await withTestServer(async (port) => {
        const adminId = await createUser(admin);
        const token = await generateAccessToken(adminId);
        const updateData = { role: Role.SUPER_ADMIN };

        const response = await fetch(
          `http://localhost:${port}/api/users/${adminId}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(updateData),
          },
        );
        expect(response.status).toBe(403);
        const responseBody = await response.json();
        expect(typeof responseBody).toBe('object');
        expect(responseBody.message).toBe('Cannot change role to higher');
        expect(responseBody.name).toBe('Forbidden');
        expect(responseBody.path).toBe('access_token');
        expect(responseBody.type).toBe('Forbidden');
      });
    });

    it('should allow admin to change self role to user', async () => {
      await withTestServer(async (port) => {
        const adminId = await createUser(admin);
        const token = await generateAccessToken(adminId);
        const updateData = { role: Role.USER };

        const response = await fetch(
          `http://localhost:${port}/api/users/${adminId}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(updateData),
          },
        );
        expect(response.status).toBe(200);
        const responseBody = await response.json();
        expect(response.status).toBe(200);
        expect(typeof responseBody).toBe('object');
        expect(responseBody.name).toBe(admin.name);
        expect(responseBody.email).toBe(admin.email);
        expect(responseBody.role).toBe(updateData.role);
        expect(responseBody.isDisabled).toBe(admin.isDisabled);
        expect(responseBody.createdAt).toBeDefined();
        expect(responseBody.updatedAt).toBeDefined();
      });
    });
  });
});
