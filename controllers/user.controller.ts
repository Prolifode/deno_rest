import { roles } from "../config/roles.ts";
import type { RouterContext } from "../deps.ts";
import log from "../middlewares/logger.middleware.ts";
import UserService from "../services/user.service.ts";

class UserController {
  /**
   * Create User function
   * @param request
   * @param response
   * @returns Promise<void>
   */
  public static async create(
    { request, response }: RouterContext,
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
      isVerified: false,
      isDisabled: typeof isDisabled === "boolean" ? isDisabled : false,
    });
  }

  /**
   * Signup User function
   * @param request
   * @param response
   * @returns Promise<void>
   */
  public static async signup(
    { request, response }: RouterContext,
  ): Promise<void> {
    const body = request.body();
    const {
      name,
      email,
      password,
    } = await body.value;
    log.debug("Signup user");
    response.body = await UserService.signupUser({
      name,
      email,
      password,
      role: roles[0],
      isVerified: false,
      isDisabled: false,
    });
  }

  /**
   * Get single user function
   * @param response
   * @returns Promise<void>
   */
  public static async fetch({ response }: RouterContext): Promise<void> {
    log.debug("Getting users list");
    response.body = await UserService.getUsers();
  }

  /**
   * Get my user document
   * @param state
   * @param response
   * @returns Promise<void>
   */
  public static me({ state, response }: RouterContext): void {
    log.debug("Getting me data");
    response.body = state;
  }

  /**
   * Get all users function
   * @param params
   * @param response
   * @returns Promise<void>
   */
  public static async show({ params, response }: RouterContext): Promise<void> {
    const { id } = params;
    log.debug("Getting user");
    response.body = await UserService.getUser(id as string);
  }

  /**
   * Update user function
   * @param params
   * @param request
   * @param response
   * @returns Promise<void>
   */
  public static async update(
    { params, request, response }: RouterContext,
  ): Promise<void> {
    const { id } = params;
    const body = request.body();
    const { name, role, isVerified, isDisabled } = await body.value;
    log.debug("Updating user");
    response.body = await UserService.updateUser(id as string, {
      name,
      role,
      isVerified,
      isDisabled,
    });
  }

  /**
   * Delete user function
   * @param params
   * @param response
   * @returns Promise<void>
   */
  public static async remove(
    { params, response }: RouterContext,
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
