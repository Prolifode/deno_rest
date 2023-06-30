import {
  afterAll,
  beforeEach,
  Bson,
  describe,
  expect,
  it,
  superoak,
} from '../../../deps.ts';
import { app } from '../../../app.ts';
import {
  clearCollection,
  createUser,
  generateAccessToken,
} from '../../utils/utils.ts';
import { User } from '../../../models/user.model.ts';
import { admin, user } from '../../fixtures/users.fixtures.ts';

describe('Users endpoints DELETE', () => {
  beforeEach(async () => {
    await clearCollection('users');
  });

  afterAll(async () => {
    await clearCollection('users');
  });

  describe('DELETE users/', () => {
    it('should allow admin to delete user', async () => {
      const adminId = await createUser(admin);
      const userId = await createUser(user);
      const token = await generateAccessToken(adminId);
      const request = await superoak(app);
      await request.delete(`/api/users/${userId}`)
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .expect(204);
      const dbUser = await User.findOne(
        { _id: new Bson.ObjectId(userId) },
      );
      expect(typeof dbUser).toBe('undefined');
    });

    it('should be able to re create user upon deletion', async () => {
      const adminId = await createUser(admin);
      const userId = await createUser(user);
      const token = await generateAccessToken(adminId);
      const request = await superoak(app);
      await request.delete(`/api/users/${userId}`)
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .expect(204);
      const dbUser = await User.findOne(
        { _id: new Bson.ObjectId(userId) },
      );
      const dupUserId = await createUser(user);
      expect(typeof dbUser).toBe('undefined');
      expect(typeof dupUserId).toBeDefined();
    });

    it('should allow user to delete self', async () => {
      const userId = await createUser(user);
      const token = await generateAccessToken(userId);
      const request = await superoak(app);
      await request.delete(`/api/users/${userId}`)
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .expect(204);
      const dbUser = await User.findOne(
        { _id: new Bson.ObjectId(userId) },
      );
      expect(typeof dbUser).toBe('undefined');
    });

    it('should return error if user does not exist', async () => {
      const adminId = await createUser(admin);
      const token = await generateAccessToken(adminId);
      const userId = new Bson.ObjectId('62443d478172bbcedcedc130');

      const request = await superoak(app);
      const response = await request.delete(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404);

      expect(response.body.message).toBeDefined();
      expect(response.body.status).toBe(404);
      expect(response.body.name).toBe('NotFound');
      expect(response.body.path).toBe('user');
      expect(response.body.param).toBe('user');
      expect(response.body.type).toBe('NotFound');
      expect(response.body.message).toBe('User not found');
    });

    it('should return error if ID format is invalid', async () => {
      const adminId = await createUser(admin);
      const token = await generateAccessToken(adminId);
      const userId = 'asdas333';

      const request = await superoak(app);
      const response = await request.delete(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(400);
      expect(response.body.message).toBeDefined();
      expect(response.body.status).toBe(400);
      expect(response.body.name).toBe('BadRequest');
      expect(response.body.path).toBe('id');
      expect(response.body.param).toBe('id');
      expect(response.body.type).toBe('BadRequest');
      expect(response.body.message).toBe(
        'Argument passed in must be a string of 12 bytes or a string of 24 hex characters or an integer',
      );
    });
  });
});
