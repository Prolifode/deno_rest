import { afterAll, beforeEach, describe, it } from 'jsr:@std/testing/bdd';
import { Status } from 'jsr:@oak/oak';
import { expect } from '@std/expect';
import {
  clearCollection,
  createUser,
  withTestServer,
} from '../../utils/utils.ts';
import { user } from '../../fixtures/users.fixtures.ts';

describe('Auth endpoints POST', () => {
  beforeEach(async () => {
    await clearCollection('users');
    await clearCollection('tokens');
  });

  afterAll(async () => {
    await clearCollection('users');
    await clearCollection('tokens');
  });

  describe('POST /auth/login', () => {
    it('should login', async () => {
      await withTestServer(async (port) => {
        // Create a user in the database first.
        const userId = await createUser(user);
        const { email, password } = user;

        // Send a login request using fetch.
        const response = await fetch(
          `http://localhost:${port}/api/auth/login`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          },
        );
        expect(response.status).toBe(200);
        const responseBody = await response.json();

        // Validate response payload.
        expect(typeof responseBody).toBe('object');
        expect(responseBody.tokens).toBeDefined();
        expect(responseBody.tokens.access).toBeDefined();
        expect(responseBody.tokens.access.token).toBeDefined();
        expect(typeof responseBody.tokens.access.token).toBe('string');
        expect(responseBody.tokens.access.expires).toBeDefined();
        expect(typeof responseBody.tokens.access.expires).toBe('string');
        expect(responseBody.tokens.refresh).toBeDefined();
        expect(responseBody.tokens.refresh.token).toBeDefined();
        expect(typeof responseBody.tokens.refresh.token).toBe('string');
        expect(responseBody.tokens.refresh.expires).toBeDefined();
        expect(typeof responseBody.tokens.refresh.expires).toBe('string');
        expect(responseBody.user).toBeDefined();
        expect(responseBody.user.id).toBe(userId);
        expect(responseBody.user.name).toBe(user.name);
        expect(responseBody.user.email).toBe(user.email);
        expect(responseBody.user.role).toBe(user.role);
        expect(responseBody.user.isDisabled).toBe(user.isDisabled);
      });
    });

    it('should return error if user does not exist', async () => {
      await withTestServer(async (port) => {
        const { email, password } = user;
        const response = await fetch(
          `http://localhost:${port}/api/auth/login`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          },
        );
        expect(response.status).toBe(Status.Unauthorized);
        const responseBody = await response.json();
        expect(responseBody.message).toBeDefined();
        expect(responseBody.message).toBe('email or password is not correct');
        expect(responseBody.name).toBe('Unauthorized');
        expect(responseBody.path).toBe('password');
        expect(responseBody.type).toBe('Unauthorized');
        expect(responseBody.status).toBe(Status.Unauthorized);
      });
    });

    it('should return error if password is incorrect', async () => {
      await withTestServer(async (port) => {
        const { email } = user;
        const wrongPassword = 'incorrectPassword';
        const response = await fetch(
          `http://localhost:${port}/api/auth/login`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password: wrongPassword }),
          },
        );
        expect(response.status).toBe(401);
        const responseBody = await response.json();
        expect(responseBody.message).toBeDefined();
        expect(responseBody.message).toBe('email or password is not correct');
        expect(responseBody.name).toBe('Unauthorized');
        expect(responseBody.path).toBe('password');
        expect(responseBody.type).toBe('Unauthorized');
        expect(responseBody.status).toBe(Status.Unauthorized);
      });
    });
  });

  describe('POST /auth/refresh-tokens', () => {
    it('should get new access token', async () => {
      await withTestServer(async (port) => {
        // Create a user and log in.
        await createUser(user);
        const { email, password } = user;

        const loginResponse = await fetch(
          `http://localhost:${port}/api/auth/login`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          },
        );
        expect(loginResponse.status).toBe(200);
        const loginBody = await loginResponse.json();

        // Use the returned tokens to request a refresh.
        const response = await fetch(
          `http://localhost:${port}/api/auth/refresh-tokens`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${loginBody.tokens.access.token}`,
            },
            body: JSON.stringify({
              refreshToken: loginBody.tokens.refresh.token,
            }),
          },
        );
        expect(response.status).toBe(200);
        const responseBody = await response.json();

        // Validate that the new tokens are correctly returned.
        expect(typeof responseBody).toBe('object');
        expect(responseBody.tokens).toBeDefined();
        expect(responseBody.tokens.access).toBeDefined();
        expect(responseBody.tokens.access.token).toBeDefined();
        expect(typeof responseBody.tokens.access.token).toBe('string');
        expect(responseBody.tokens.access.expires).toBeDefined();
        expect(typeof responseBody.tokens.access.expires).toBe('string');
        expect(responseBody.tokens.refresh).toBeDefined();
        expect(responseBody.tokens.refresh.token).toBeDefined();
        expect(typeof responseBody.tokens.refresh.token).toBe('string');
        expect(responseBody.tokens.refresh.expires).toBeDefined();
        expect(typeof responseBody.tokens.refresh.expires).toBe('string');
      });
    });

    it('should return error if token is invalid', async () => {
      await withTestServer(async (port) => {
        // Prepare: create a user and log in.
        const invalidRefreshToken = 'invalidToken';
        await createUser(user);
        const { email, password } = user;

        const loginResponse = await fetch(
          `http://localhost:${port}/api/auth/login`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          },
        );
        expect(loginResponse.status).toBe(200);
        const loginBody = await loginResponse.json();

        // Attempt to refresh tokens using an invalid refresh token.
        const response = await fetch(
          `http://localhost:${port}/api/auth/refresh-tokens`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${loginBody.tokens.access.token}`,
            },
            body: JSON.stringify({ refreshToken: invalidRefreshToken }),
          },
        );
        expect(response.status).toBe(401);
        const responseBody = await response.json();
        expect(responseBody.message).toBeDefined();
        expect(responseBody.message).toBe('refresh_token is invalid');
      });
    });
  });
});
