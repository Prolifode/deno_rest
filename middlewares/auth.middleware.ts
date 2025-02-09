import {
  PermissionList,
  Role,
  ROLE_RIGHTS,
  ROLES_WITH_USER_MANAGEMENT_OVERRIDE,
} from '../config/roles.ts';
import { RouterMiddleware, Status } from 'jsr:@oak/oak';
import type { RouterContext } from 'jsr:@oak/oak';
import JwtHelper from '../helpers/jwt.helper.ts';
import UserService from '../services/user.service.ts';
import type { UserStructure } from '../types/types.interface.ts';
import { throwError } from './errorHandler.middleware.ts';

/**
 * Check if user has required rights
 * @param requiredRights
 * @param userRights
 * @returns boolean
 */
const hasRequiredRights = (
  requiredRights: string[],
  userRights: string[],
): boolean => {
  return requiredRights.some((requiredRight) =>
    userRights.includes(requiredRight)
  );
};

/**
 * Check if user has "MANAGE_SELF" right and the ID matches the user ID
 * @param requiredRights
 * @param user
 * @param userIdFromPayload
 * @returns boolean
 */
const hasManageSelfRights = (
  requiredRights: string[],
  user: UserStructure,
  userIdFromPayload: string,
): boolean => {
  const hasManageSelfRight = requiredRights.includes(
    PermissionList.MANAGE_USERS,
  );
  return !(hasManageSelfRight && userIdFromPayload &&
    user.id !== userIdFromPayload &&
    ROLES_WITH_USER_MANAGEMENT_OVERRIDE.indexOf(user.role as Role) < 0);
};

/**
 * Extract JWT from Authorization header
 * @param header
 * @returns string | null
 */
const extractJwt = (header: string | null): string | null => {
  if (!header || !header.includes('Bearer')) {
    return null;
  }
  return header.split('Bearer ')[1];
};

export const auth =
  <Path extends string>(requiredRights: string[]): RouterMiddleware<Path> =>
  async (
    ctx: RouterContext<Path>,
    next: () => Promise<unknown>,
  ): Promise<Error | void> => {
    const JWT: string | null = extractJwt(
      ctx.request.headers.get('Authorization'),
    );

    if (!JWT) {
      return throwError({
        status: Status.Unauthorized,
        name: 'Unauthorized',
        path: `access_token`,
        param: `access_token`,
        message: `access_token is required`,
        type: 'Unauthorized',
      });
    }

    const data: { id: string } | Error = await JwtHelper.getJwtPayload(JWT) as {
      id: string;
    } | Error;

    if (data instanceof Error) {
      return throwError({
        status: Status.Unauthorized,
        name: 'Unauthorized',
        path: `access_token`,
        param: `access_token`,
        message: `access_token is invalid`,
        type: 'Unauthorized',
      });
    }

    const user: UserStructure | Error = await UserService.getUser(data.id);

    if (user instanceof Error) {
      return throwError({
        status: Status.Unauthorized,
        name: 'Unauthorized',
        path: `access_token`,
        param: `access_token`,
        message: `User not found`,
        type: 'Unauthorized',
      });
    }

    const userRights = ROLE_RIGHTS.get(user.role);
    const hasRight: boolean = hasRequiredRights(requiredRights, userRights);
    const isSelfManaged: boolean = hasManageSelfRights(
      requiredRights,
      user,
      ctx.params?.id || '',
    );

    if (!hasRight || !isSelfManaged) {
      return throwError({
        status: Status.Forbidden,
        name: 'Forbidden',
        path: `access_token`,
        param: `access_token`,
        message: `Insufficient rights`,
        type: 'Forbidden',
      });
    }

    ctx.state = user;
    await next();
  };
