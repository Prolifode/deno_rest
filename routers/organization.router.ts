import { Router } from "../deps.ts";
import Controller from "../controllers/organization.controller.ts";
import { auth } from "../middlewares/auth.middleware.ts";
import { validate } from "../middlewares/validate.middleware.ts";
import {
  createUserValidation,
  deleteUserValidation,
  getUsersValidation,
  getUserValidation,
  updateUserValidation,
} from "../validations/user.validation.ts";

const router = new Router();
const path = "/api/organizations";
router.post(
  path,
  auth(["manageUsers"]),
  validate(createUserValidation),
  Controller.create
);

router.get(
  "/api/organizations",
  // auth(["getUsers"]),
  validate(getUsersValidation),
  Controller.fetch
);

router.get(
  path + "/:id",
  auth(["getUsers"]),
  validate(getUserValidation),
  Controller.show
);

router.put(
  path + "/:id",
  auth(["manageUsers", "updateMe"]),
  validate(updateUserValidation),
  Controller.update
);

router.delete(
  path + "/:id",
  auth(["manageUsers"]),
  validate(deleteUserValidation),
  Controller.remove
);

export default router;
