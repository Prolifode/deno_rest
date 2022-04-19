import { roles } from "../config/roles.ts";
import type { RouterContext } from "../deps.ts";
import log from "../middlewares/logger.middleware.ts";
import UserService from "../services/user.service.ts";
import { Status } from "../deps.ts";

class UserController {
  /**
   * Create User function
   * @param request
   * @param response
   * @returns Promise<void>
   */
  public static async create(
    { request, response }: RouterContext<string>,
  ): Promise<void> {
    const body = request.body();
    const {
      name,
      email,
      password,
      role,
      isDisabled,
    } = await body.value;
    log.debug("Creating user");
    response.body = await UserService.createUser({
      name,
      email,
      password,
      role: role || roles[0],
      isDisabled: typeof isDisabled === "boolean" ? isDisabled : false,
    });
    response.status = Status.Created;
  }

  /**
   * Get single user function
   * @param response
   * @returns Promise<void>
   */
  public static async fetch(
    { response }: RouterContext<string>,
  ): Promise<void> {
    log.debug("Getting users list");
    response.body = await UserService.getUsers();
  }

  /**
   * Get my user document
   * @param state
   * @param response
   * @returns Promise<void>
   */
  public static me({ state, response }: RouterContext<string>): void {
    log.debug("Getting me data");
    response.body = state;
  }

  /**
   * Get all users function
   * @param params
   * @param response
   * @returns Promise<void>
   */
  public static async show(
    { params, response }: RouterContext<string>,
  ): Promise<void> {
    const { id } = params;
    log.debug("Getting user");
    response.body = await UserService.getUser(id as string);
  }

  /**
   * Update user function
   * @param params
   * @param request
   * @param response
   * @param state
   * @returns Promise<void>
   */
  public static async update(
    { params, request, response, state }: RouterContext<string>,
  ): Promise<void | Error> {
    const { id } = params;
    const body = request.body();
    const { name, email, role, isDisabled } = await body.value;
    log.debug("Updating user");
    await UserService.updateUser(id as string, state, {
      name,
      email,
      role,
      isDisabled,
    });
    response.body = await UserService.getUser(id as string);
  }

  /**
   * Delete user function
   * @param params
   * @param response
   * @returns Promise<void>
   */
  public static async remove(
    { params, response }: RouterContext<string>,
  ): Promise<void> {
    const { id } = params;
    log.debug("Removing user");
    const deleteCount: number | Error = await UserService.removeUser(
      id as string,
    );
    response.body = { deleted: deleteCount };
  }
}

export default UserController;
