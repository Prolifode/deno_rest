export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

export enum PermissionList {
  GET_ME = 'GET_ME',
  UPDATE_ME = 'UPDATE_ME',
  GET_USERS = 'GET_USERS',
  MANAGE_USERS = 'MANAGE_USERS',
}

export const rolesRank = [Role.USER, Role.ADMIN, Role.SUPER_ADMIN];
export const roleRights = new Map();
roleRights.set(Role.USER, [
  PermissionList.GET_ME,
  PermissionList.UPDATE_ME,
]);

roleRights.set(Role.ADMIN, [
  PermissionList.GET_ME,
  PermissionList.UPDATE_ME,
  PermissionList.GET_USERS,
  PermissionList.MANAGE_USERS,
]);

roleRights.set(Role.SUPER_ADMIN, [
  PermissionList.GET_ME,
  PermissionList.UPDATE_ME,
  PermissionList.GET_USERS,
  PermissionList.MANAGE_USERS,
]);
