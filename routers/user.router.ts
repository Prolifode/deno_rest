import { Router } from 'jsr:@oak/oak';
import UserController from '../controllers/user.controller.ts';
import { auth } from '../middlewares/auth.middleware.ts';
import { validate } from '../middlewares/validate.middleware.ts';
import {
  createUserValidation,
  getUsersValidation,
  getUserValidation,
  meValidation,
  updateUserValidation,
} from '../validations/user.validation.ts';
import { PermissionList } from '../config/roles.ts';

const router = new Router();

router.post(
  '/api/users',
  auth([PermissionList.MANAGE_USERS]),
  validate(createUserValidation),
  UserController.create,
);

router.get(
  '/api/users',
  auth([PermissionList.MANAGE_USERS]),
  validate(getUsersValidation),
  UserController.fetch,
);

router.get(
  '/api/me',
  auth([PermissionList.GET_ME]),
  validate(meValidation),
  UserController.me,
);

router.get(
  '/api/users/:id',
  auth([PermissionList.MANAGE_USERS]),
  validate(getUserValidation),
  UserController.show,
);

router.put(
  '/api/users/:id',
  auth([PermissionList.UPDATE_ME, PermissionList.MANAGE_USERS]),
  validate(updateUserValidation),
  UserController.update,
);

router.delete(
  '/api/users/:id',
  auth([PermissionList.DELETE_ME, PermissionList.MANAGE_USERS]),
  UserController.remove,
);

export default router;
