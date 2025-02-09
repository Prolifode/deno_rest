import { Context, State, Status } from 'jsr:@oak/oak';
import type { Err, ICustomError } from '../types/types.interface.ts';
import log from './logger.middleware.ts';

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
  ctx: Context<State, Record<string, unknown>>,
  next: () => Promise<unknown>,
): Promise<void> => {
  try {
    await next();
  } catch (err) {
    const error: ICustomError = err as ICustomError;
    const status: number = error.status || error.statusCode ||
      Status.InternalServerError;
    const message: string = error.message || 'An error occurred';
    const name: string = error.name || 'Error';
    const path: string = error.path || 'Unknown path';
    const type: string = error.type || 'Unknown type';

    ctx.response.status = status;
    log.error(error);
    if (Deno.env.get('ENV') === 'production') {
      ctx.response.body = { message, status };
    } else {
      ctx.response.body = { message, name, path, type, status };
    }
  }
};
