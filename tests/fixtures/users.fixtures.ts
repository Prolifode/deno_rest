import { Role } from '../../config/roles.ts';

export const admin = {
  'name': 'Admin User',
  'email': 'admin@test.com',
  'password': '123456',
  'role': Role.ADMIN,
  'isDisabled': false,
};

export const user = {
  'name': 'Test User',
  'email': 'test@test.com',
  'password': '123456',
  'role': Role.USER,
  'isDisabled': false,
};

export const user2 = {
  'name': 'Test User',
  'email': 'test2@test.com',
  'password': '12345678',
  'role': Role.USER,
  'isDisabled': false,
};
