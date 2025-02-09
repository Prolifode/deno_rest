import { afterAll, beforeEach, describe, it } from 'jsr:@std/testing/bdd';
import { Status } from 'jsr:@oak/oak';
import { expect } from '@std/expect';
import {
  clearCollection,
  createUser,
  generateAccessToken,
  withTestServer,
} from '../../utils/utils.ts';
import { admin, user, user2 } from '../../fixtures/users.fixtures.ts';

describe('Users endpoints GET', () => {
  beforeEach(async () => {
    await clearCollection('users');
  });

  afterAll(async () => {
    await clearCollection('users');
  });

  describe('GET /users', () => {
    it('should return an array of users', async () => {
      await withTestServer(async (port) => {
        const userId = await createUser(admin);
        await createUser(user);
        await createUser(user2);
        const token = await generateAccessToken(userId);
        const tokenResponse = await fetch(
          `http://localhost:${port}/api/auth/login`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: admin.email,
              password: admin.password,
            }),
          },
        );
        expect(tokenResponse.status).toBe(200);
        await tokenResponse.json();

        const response = await fetch(
          `http://localhost:${port}/api/users`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          },
        );
        expect(response.status).toBe(200);
        const responseBody = await response.json();
        expect(responseBody.users.length).toBe(3);
        expect(responseBody.users).toBeDefined();
      });
    });

    it('should not allow any query string', async () => {
      await withTestServer(async (port) => {
        const userId = await createUser(admin);
        const token = await generateAccessToken(userId);
        const tokenResponse = await fetch(
          `http://localhost:${port}/api/auth/login`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: admin.email,
              password: admin.password,
            }),
          },
        );
        expect(tokenResponse.status).toBe(200);
        await tokenResponse.json();

        const response = await fetch(
          `http://localhost:${port}/api/users?query=something`,
          {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` },
          },
        );
        expect(response.status).toBe(400);
        const responseBody = await response.json();

        expect(typeof responseBody).toBe('object');
        expect(responseBody.message).toBe('query is not allowed');
        expect(responseBody.name).toBe('ValidationError');
        expect(responseBody.path).toBe('query');
        expect(responseBody.type).toBe('BadRequest');
        expect(responseBody.status).toBe(Status.BadRequest);
      });
    });
  });
});
