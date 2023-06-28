import { Router } from '../deps.ts';
import UserController from '../controllers/user.controller.ts';
import { auth } from '../middlewares/auth.middleware.ts';
import { validate } from '../middlewares/validate.middleware.ts';
import {
  createUserValidation,
  deleteUserValidation,
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
  auth([PermissionList.GET_USERS]),
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
  auth([PermissionList.GET_USERS]),
  validate(getUserValidation),
  UserController.show,
);

router.put(
  '/api/users/:id',
  auth([PermissionList.MANAGE_USERS, PermissionList.UPDATE_ME]),
  validate(updateUserValidation),
  UserController.update,
);

router.delete(
  '/api/users/:id',
  auth([PermissionList.MANAGE_USERS]),
  validate(deleteUserValidation),
  UserController.remove,
);

export default router;
