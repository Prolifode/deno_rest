import AuthController from '../controllers/auth.controller.ts';
import { Router } from 'jsr:@oak/oak';
import { validate } from '../middlewares/validate.middleware.ts';
import {
  loginValidation,
  refreshTokenValidation,
} from '../validations/auth.validation.ts';

const router = new Router();

router.post(
  '/api/auth/login',
  validate(loginValidation),
  AuthController.login,
);

router.post(
  '/api/auth/refresh-tokens',
  validate(refreshTokenValidation),
  AuthController.refreshTokens,
);

export default router;
