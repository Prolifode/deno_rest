import { afterAll, beforeEach, describe, it } from 'jsr:@std/testing/bdd';
import { expect } from '@std/expect';
import {
  clearCollection,
  createUser,
  generateAccessToken,
  withTestServer,
} from '../../utils/utils.ts';
import { ObjectId } from '@db/mongo';
import { User } from '../../../models/user.model.ts';
import { admin, user, user2 } from '../../fixtures/users.fixtures.ts';
import { Role, ROLES_RANK } from '../../../config/roles.ts';

describe('Users endpoints POST', () => {
  beforeEach(async () => {
    await clearCollection('users');
  });

  afterAll(async () => {
    await clearCollection('users');
  });

  describe('POST /users', () => {
    it('should create user', async () => {
      await withTestServer(async (port) => {
        // Create an admin user and generate an access token.
        const userId = await createUser(admin);
        const token = await generateAccessToken(userId);

        // Send a POST request to create a new user.
        const response = await fetch(`http://localhost:${port}/api/users`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(user),
        });
        expect(response.status).toBe(201);
        const responseBody = await response.json();
        expect(typeof responseBody).toBe('string');

        // Retrieve the user from the database using the returned id.
        const dbUser = await User.findOne({
          _id: new ObjectId(responseBody),
        });
        expect(dbUser?.name).toBe(user.name);
        expect(dbUser?.email).toBe(user.email);
        expect(dbUser?.role).toBe(user.role);
        expect(dbUser?.isDisabled).toBe(user.isDisabled);
        expect(dbUser?.docVersion).toBe(1);
        expect(dbUser?.createdAt).toBeDefined();
        expect(dbUser?.updatedAt).toBeUndefined();
      });
    });

    it('should conflict if user already exists in database', async () => {
      await withTestServer(async (port) => {
        const userId = await createUser(admin);
        const token = await generateAccessToken(userId);

        // Attempt to create a user that already exists.
        const response = await fetch(`http://localhost:${port}/api/users`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(admin),
        });
        expect(response.status).toBe(409);
        await response.json();
        const dbUsers = await User.find({ email: admin.email }).toArray();
        expect(dbUsers.length).toBe(1);
      });
    });

    it('should throw invalid name error', async () => {
      await withTestServer(async (port) => {
        const userId = await createUser(admin);
        const token = await generateAccessToken(userId);
        const invalidUser = { ...user, name: '' };

        const response = await fetch(`http://localhost:${port}/api/users`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(invalidUser),
        });
        expect(response.status).toBe(400);
        const responseBody = await response.json();
        const dbUsers = await User.find({ email: invalidUser.email }).toArray();
        expect(dbUsers.length).toBe(0);
        expect(responseBody.message).toBe('name must be at least 1 characters');
        expect(responseBody.name).toBe('ValidationError');
        expect(responseBody.path).toBe('name');
        expect(responseBody.type).toBe('min');
      });
    });

    it('should throw max name error', async () => {
      await withTestServer(async (port) => {
        const userId = await createUser(admin);
        const token = await generateAccessToken(userId);
        const invalidUser = { ...user };
        invalidUser.name =
          'Lorem Ipsum is simply dummy text of the printing and typesetting industry' +
          'Lorem Ipsum is simply dummy text of the printing and typesetting industry' +
          'Lorem Ipsum is simply dummy text of the printing and typesetting industry' +
          'Lorem Ipsum is simply dummy text of the printing and typesetting industry' +
          'Lorem Ipsum is simply dummy text of the printing and typesetting industry' +
          'Lorem Ipsum is simply dummy text of the printing and typesetting industry' +
          'Lorem Ipsum is simply dummy text of the printing and typesetting industry' +
          'Lorem Ipsum is simply dummy text of the printing and typesetting industry' +
          'Lorem Ipsum is simply dummy text of the printing and typesetting industry';

        const response = await fetch(`http://localhost:${port}/api/users`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(invalidUser),
        });
        expect(response.status).toBe(400);
        const responseBody = await response.json();
        const dbUsers = await User.find({ email: invalidUser.email }).toArray();
        expect(dbUsers.length).toBe(0);
        expect(responseBody.message).toBe(
          'name must be at most 255 characters',
        );
        expect(responseBody.name).toBe('ValidationError');
        expect(responseBody.path).toBe('name');
        expect(responseBody.type).toBe('max');
      });
    });

    it('should throw missing email error', async () => {
      await withTestServer(async (port) => {
        const userId = await createUser(admin);
        const token = await generateAccessToken(userId);
        const invalidUser = { ...user, email: '' };

        const response = await fetch(`http://localhost:${port}/api/users`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(invalidUser),
        });
        expect(response.status).toBe(400);
        const responseBody = await response.json();
        const dbUsers = await User.find({ email: invalidUser.email }).toArray();
        expect(dbUsers.length).toBe(0);
        expect(responseBody.message).toBe('email is required');
        expect(responseBody.name).toBe('ValidationError');
        expect(responseBody.path).toBe('email');
        expect(responseBody.type).toBe('required');
      });
    });

    it('should throw invalid email error', async () => {
      await withTestServer(async (port) => {
        const userId = await createUser(admin);
        const token = await generateAccessToken(userId);
        const invalidUser = { ...user, email: 'invalidemail' };

        const response = await fetch(`http://localhost:${port}/api/users`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(invalidUser),
        });
        expect(response.status).toBe(400);
        const responseBody = await response.json();
        const dbUsers = await User.find({ email: invalidUser.email }).toArray();
        expect(dbUsers.length).toBe(0);
        expect(responseBody.message).toBe('email must be a valid email');
        expect(responseBody.name).toBe('ValidationError');
        expect(responseBody.path).toBe('email');
        expect(responseBody.type).toBe('email');
      });
    });

    it('should throw missing password error', async () => {
      await withTestServer(async (port) => {
        const userId = await createUser(admin);
        const token = await generateAccessToken(userId);
        const invalidUser = { ...user, password: '' };

        const response = await fetch(`http://localhost:${port}/api/users`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(invalidUser),
        });
        expect(response.status).toBe(400);
        const responseBody = await response.json();
        const dbUsers = await User.find({ email: invalidUser.email }).toArray();
        expect(dbUsers.length).toBe(0);
        expect(responseBody.message).toBe('password is a required field');
        expect(responseBody.name).toBe('ValidationError');
        expect(responseBody.path).toBe('password');
        expect(responseBody.type).toBe('required');
      });
    });

    it('should throw max password error', async () => {
      await withTestServer(async (port) => {
        const userId = await createUser(admin);
        const token = await generateAccessToken(userId);
        const invalidUser = { ...user };
        invalidUser.password =
          'Lorem Ipsum is simply dummy text of the printing and typesetting industry' +
          'Lorem Ipsum is simply dummy text of the printing and typesetting industry' +
          'Lorem Ipsum is simply dummy text of the printing and typesetting industry' +
          'Lorem Ipsum is simply dummy text of the printing and typesetting industry' +
          'Lorem Ipsum is simply dummy text of the printing and typesetting industry' +
          'Lorem Ipsum is simply dummy text of the printing and typesetting industry' +
          'Lorem Ipsum is simply dummy text of the printing and typesetting industry' +
          'Lorem Ipsum is simply dummy text of the printing and typesetting industry' +
          'Lorem Ipsum is simply dummy text of the printing and typesetting industry';

        const response = await fetch(`http://localhost:${port}/api/users`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(invalidUser),
        });
        expect(response.status).toBe(400);
        const responseBody = await response.json();
        const dbUsers = await User.find({ email: invalidUser.email }).toArray();
        expect(dbUsers.length).toBe(0);
        expect(responseBody.message).toBe(
          'password must be at most 255 characters',
        );
        expect(responseBody.name).toBe('ValidationError');
        expect(responseBody.path).toBe('password');
        expect(responseBody.type).toBe('max');
      });
    });

    it('should throw invalid password error', async () => {
      await withTestServer(async (port) => {
        const userId = await createUser(admin);
        const token = await generateAccessToken(userId);
        const invalidUser = { ...user, password: '1' };

        const response = await fetch(`http://localhost:${port}/api/users`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(invalidUser),
        });
        expect(response.status).toBe(400);
        const responseBody = await response.json();
        const dbUsers = await User.find({ email: invalidUser.email }).toArray();
        expect(dbUsers.length).toBe(0);
        expect(responseBody.message).toBe(
          'password must be at least 6 characters',
        );
        expect(responseBody.name).toBe('ValidationError');
        expect(responseBody.path).toBe('password');
        expect(responseBody.type).toBe('min');
      });
    });

    it('should throw invalid role error', async () => {
      await withTestServer(async (port) => {
        const userId = await createUser(admin);
        const token = await generateAccessToken(userId);
        // Change the role to an invalid value.
        const invalidUser = { ...user, role: '1' as Role };

        const response = await fetch(`http://localhost:${port}/api/users`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(invalidUser),
        });
        expect(response.status).toBe(400);
        const responseBody = await response.json();
        const dbUsers = await User.find({ email: invalidUser.email }).toArray();
        expect(dbUsers.length).toBe(0);
        expect(responseBody.message).toBe(
          `role must be one of the following values: ${ROLES_RANK.join(', ')}`,
        );
        expect(responseBody.name).toBe('ValidationError');
        expect(responseBody.path).toBe('role');
        expect(responseBody.type).toBe('oneOf');
      });
    });

    it('should not create user if no admin rights', async () => {
      await withTestServer(async (port) => {
        // Create a non-admin user and generate a token.
        const userId = await createUser(user);
        const token = await generateAccessToken(userId);

        const response = await fetch(`http://localhost:${port}/api/users`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(user2),
        });
        expect(response.status).toBe(403);
        const responseBody = await response.json();
        const dbUsers = await User.find({ email: user2.email }).toArray();
        expect(dbUsers.length).toBe(0);
        expect(responseBody.message).toBe('Insufficient rights');
        expect(responseBody.name).toBe('Forbidden');
        expect(responseBody.path).toBe('access_token');
        expect(responseBody.type).toBe('Forbidden');
      });
    });
  });
});
