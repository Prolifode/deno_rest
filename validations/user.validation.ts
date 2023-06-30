import { yup } from '../deps.ts';
import { Role, ROLES_RANK } from '../config/roles.ts';

export const createUserValidation = {
  body: yup.object({
    name: yup
      .string()
      .min(1)
      .max(255)
      .trim()
      .required(`name is required`),
    email: yup
      .string()
      .email()
      .trim()
      .required(`email is required`),
    password: yup
      .string()
      .required()
      .min(6)
      .max(255),
    role: yup
      .string()
      .default(Role.USER)
      .oneOf(ROLES_RANK),
    isDisabled: yup
      .bool()
      .default(false),
  }),
};

export const meValidation = {};

export const getUserValidation = {
  params: yup.object({
    id: yup
      .string()
      .required()
      .trim(),
  }),
};

/* Strict Validation
* This will validate any invalid query params
* e.g. /users?some-invalid-query=shouldnt_allow
* */
export const getUsersValidation = {};

export const updateUserValidation = {
  params: yup.object({
    id: yup
      .string()
      .required()
      .trim(),
  }),
  body: yup.object({
    name: yup
      .string()
      .min(1)
      .max(255)
      .trim(),
    email: yup
      .string()
      .email()
      .trim(),
    role: yup
      .string()
      .default(Role.USER)
      .oneOf(ROLES_RANK),
    isDisabled: yup
      .bool(),
  }),
};

export const deleteUserValidation = {
  params: yup.object({
    id: yup
      .string()
      .required()
      .trim(),
  }),
};
