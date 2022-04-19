import AuthController from "../controllers/auth.controller.ts";
import { Router } from "../deps.ts";
import { validate } from "../middlewares/validate.middleware.ts";
import {
  loginValidation,
  refreshTokenValidation,
} from "../validations/auth.validation.ts";

// deno-lint-ignore no-explicit-any
const router: any = new Router();

router.post(
  "/api/auth/login",
  validate(loginValidation),
  AuthController.login,
);

router.post(
  "/api/auth/refresh-tokens",
  validate(refreshTokenValidation),
  AuthController.refreshTokens,
);

export default router;
