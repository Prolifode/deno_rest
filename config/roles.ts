export const roles = ["user", "admin", "superAdmin"];
export const roleRights = new Map();
roleRights.set(roles[0], [
  "getMe",
  "updateMe",
]);
roleRights.set(roles[1], [
  "getMe",
  "getUsers",
  "manageUsers",
  "updateMe",
]);
