// deno-lint-ignore-file

import { helpers, RouterContext, RouterMiddleware, Status } from '../deps.ts';
import { throwError } from './errorHandler.middleware.ts';

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
      throw ({ ...validationErrors, status: Status.BadRequest });
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
    await validateParams(schema.body, await ctx.request.body().value, 'body');
    await validateParams(schema.params, ctx.params, 'param');
    await validateParams(schema.queries, helpers.getQuery(ctx), 'query');
    await next();
  };
