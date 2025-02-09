import { afterAll, beforeEach, describe, it } from 'jsr:@std/testing/bdd';
import { Status } from 'jsr:@oak/oak';
import { expect } from '@std/expect';
import {
  clearCollection,
  createUser,
  generateAccessToken,
  withTestServer,
} from '../../utils/utils.ts';
import { User } from '../../../models/user.model.ts';
import { admin, user } from '../../fixtures/users.fixtures.ts';
import { ObjectId } from 'jsr:@db/mongo';

describe('Users endpoints DELETE', () => {
  beforeEach(async () => {
    await clearCollection('users');
  });

  afterAll(async () => {
    await clearCollection('users');
  });

  describe('DELETE /users/:id', () => {
    it('should allow admin to delete user', async () => {
      await withTestServer(async (port) => {
        const adminId = await createUser(admin);
        const userId = await createUser(user);
        const token = await generateAccessToken(adminId);
        const response = await fetch(
          `http://localhost:${port}/api/users/${userId}`,
          {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          },
        );
        expect(response.status).toBe(Status.NoContent);
        const dbUser = await User.findOne({ _id: new ObjectId(userId) });
        expect(dbUser).toBeUndefined();
      });
    });

    it('should allow user to delete self', async () => {
      await withTestServer(async (port) => {
        const userId = await createUser(user);
        const token = await generateAccessToken(userId);
        const response = await fetch(
          `http://localhost:${port}/api/users/${userId}`,
          {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          },
        );
        expect(response.status).toBe(Status.NoContent);
        const dbUser = await User.findOne({ _id: new ObjectId(userId) });
        expect(dbUser).toBeUndefined();
      });
    });

    it('should return error if user does not exist', async () => {
      await withTestServer(async (port) => {
        const adminId = await createUser(admin);
        const token = await generateAccessToken(adminId);
        const invalidUserId = '62443d478172bbcedcedc130';

        const response = await fetch(
          `http://localhost:${port}/api/users/${invalidUserId}`,
          {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          },
        );
        expect(response.status).toBe(Status.NotFound);
        const responseBody = await response.text();
        expect(responseBody).toBe('User not found');
      });
    });

    it('should return error if ID format is invalid', async () => {
      await withTestServer(async (port) => {
        const adminId = await createUser(admin);
        const token = await generateAccessToken(adminId);
        const invalidUserId = 'invalidID';

        const response = await fetch(
          `http://localhost:${port}/api/users/${invalidUserId}`,
          {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          },
        );
        expect(response.status).toBe(Status.BadRequest);
        const responseBody = await response.text();
        expect(responseBody).toBe(
          'Argument passed in must be a string of 12 bytes or a string of 24 hex characters or an integer',
        );
      });
    });
  });
});
