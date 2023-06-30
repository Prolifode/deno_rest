export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

export enum PermissionList {
  GET_ME = 'GET_ME',
  UPDATE_ME = 'UPDATE_ME',
  MANAGE_USERS = 'MANAGE_USERS',
  DELETE_ME = 'DELETE_ME',
}

export const ROLES_RANK = [Role.USER, Role.ADMIN, Role.SUPER_ADMIN];

/* Special Override for PermissionList.MANAGE_USERS
*  Certain roles will be permitted to override MANAGE_USERS API routes
*/
export const ROLES_WITH_USER_MANAGEMENT_OVERRIDE = [
  Role.ADMIN,
  Role.SUPER_ADMIN,
];

export const ROLE_RIGHTS = new Map();
ROLE_RIGHTS.set(Role.USER, [
  PermissionList.GET_ME,
  PermissionList.UPDATE_ME,
  PermissionList.DELETE_ME,
]);

ROLE_RIGHTS.set(Role.ADMIN, [
  ...ROLE_RIGHTS.get(Role.USER)!,
  PermissionList.MANAGE_USERS,
]);

ROLE_RIGHTS.set(Role.SUPER_ADMIN, [
  ...ROLE_RIGHTS.get(Role.ADMIN)!,
]);
