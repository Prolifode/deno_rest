import { Context, State, Status, yup } from '../deps.ts';
import type { Err } from '../types/types.interface.ts';

/**
 * Throws Error with provided params
 * @param options
 * @throws Error Throws Error
 */
export const throwError = (options: Err): Error => {
  throw options;
};

/**
 * Error Handler Middleware function
 * @param ctx
 * @param next
 * @returns Promise<void>
 */
export const errorHandler = async (
  // deno-lint-ignore no-explicit-any
  ctx: Context<State, Record<string, any>>,
  next: () => Promise<unknown>,
): Promise<void> => {
  try {
    await next();
  } catch (err) {
    if (err instanceof yup.ValidationError) {
      ctx.response.status = Status.BadRequest;
      const { errors, message } = err;
      ctx.response.body = {
        message,
        errors,
        status: Status.BadRequest,
      };
    } else {
      const { message, name, path, type } = err;
      const status = err.status || err.statusCode || Status.InternalServerError;

      ctx.response.status = status;
      ctx.response.body = { message, name, path, type, status };
    }
  }
};
