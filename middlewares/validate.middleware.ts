// deno-lint-ignore-file

import { RouterContext, RouterMiddleware, Status } from 'jsr:@oak/oak';
import { throwError } from './errorHandler.middleware.ts';
import getQueryHelper from '../helpers/getQuery.helper.ts';

const validateParams = async (
  schema: any,
  payload: any,
  type: string,
): Promise<void> => {
  if (schema?.fields && payload) {
    const allowedParams = Object.keys(schema.fields);
    const requestParams = Object.keys(payload);
    for (const param of requestParams) {
      if (!allowedParams.includes(param)) {
        throwError({
          status: Status.BadRequest,
          name: 'ValidationError',
          path: param,
          param,
          message: `${param} is not allowed`,
          type: 'BadRequest',
        });
      }
    }
    try {
      await schema.validate(payload, { stripUnknown: true, abortEarly: true });
    } catch (validationErrors) {
      throw (typeof validationErrors === 'object' && validationErrors !== null
        ? { ...validationErrors, status: Status.BadRequest }
        : { status: Status.BadRequest, message: String(validationErrors) });
    }
  } else if (payload && Object.keys(payload).length) {
    throwError({
      status: Status.BadRequest,
      name: 'ValidationError',
      path: type,
      param: type,
      message: `${type} is not allowed`,
      type: 'BadRequest',
    });
  }
};

export const validate =
  <Path extends string>(schema: any): RouterMiddleware<Path> =>
  async (ctx: RouterContext<Path>, next: () => any): Promise<void> => {
    await validateParams(
      schema.body,
      ctx.request.hasBody ? await ctx.request.body.json() : null,
      'body',
    );
    await validateParams(schema.params, ctx.params, 'param');
    await validateParams(schema.queries, getQueryHelper(ctx), 'query');
    await next();
  };
