/**
 * Class UserController
 *
 * This class handles user-related tasks. It uses the UserService class to perform
 * tasks such as creating, retrieving, updating and deleting users. This class acts as a controller layer between the
 * HTTP server and the service layer, thereby reducing the coupling between these layers.
 *
 * @import roles - Roles configuration imported from `roles.ts`
 * @import { RouterContext } - A type from `deps.ts` that denotes the context in which the router operates.
 * @import log - A logger middleware imported from `logger.middleware.ts` used to log debug information.
 * @import UserService - A service class imported from `user.service.ts` used to perform user-related operations.
 * @import { Status } - A enum imported from `deps.ts` which represents the HTTP status codes.
 *
 * @method create() - An asynchronous method that extracts user details from the request body, logs the user creation attempt,
 * calls the UserService.createUser() method to create a new user and sets the HTTP status code to `Created`.
 *
 * @method fetch() - An asynchronous method that logs the user retrieval attempt and calls the UserService.getUsers() method to
 * retrieve a list of all users.
 *
 * @method me() - A synchronous method that logs the data retrieval attempt and sets the response body to the state received from the RouterContext.
 *
 * @method show() - An asynchronous method that extracts the user id from the parameters, logs the single user retrieval attempt,
 * and calls the UserService.getUser() method to retrieve the details of a single user.
 *
 * @method update() - An asynchronous method that extracts the user id and new user details from the request, logs the user update attempt,
 * calls the UserService.updateUser() method to update the user details and finally calls UserService.getUser() to retrieve the updated user details.
 *
 * @method remove() - An asynchronous method that extracts the user id from the parameters, logs the user deletion attempt,
 * and calls the UserService.removeUser() method to delete a user, then sets the response body to the count of deleted records.
 *
 * @exports UserController - This class is exported for use in other parts of the application.
 */
import { Role } from '../config/roles.ts';
import type { RouterContext } from 'jsr:@oak/oak';
import { Status } from 'jsr:@oak/oak';
import log from '../middlewares/logger.middleware.ts';
import UserService from '../services/user.service.ts';

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
    const body = request.body;
    const {
      name,
      email,
      password,
      role,
      isDisabled,
    } = await body.json();
    log.debug('Creating user');
    response.body = await UserService.createUser({
      name,
      email,
      password,
      role: role || Role.USER,
      isDisabled: typeof isDisabled === 'boolean' ? isDisabled : false,
    });
    response.status = Status.Created;
  }

  /**
   * Get all users function
   * @param params
   * @param response
   * @returns Promise<void>
   */
  public static async fetch(
    { response }: RouterContext<string>,
  ): Promise<void> {
    log.debug('Getting users list');
    response.body = JSON.stringify(await UserService.getUsers());
  }

  /**
   * Get my user document
   * @param state
   * @param response
   * @returns Promise<void>
   */
  public static me({ state, response }: RouterContext<string>): void {
    log.debug('Getting me data');
    response.body = state;
  }

  /**
   * Get single user function
   * @param response
   * @returns Promise<void>
   */
  public static async show(
    { params, response }: RouterContext<string>,
  ): Promise<void> {
    const { id } = params;
    log.debug('Getting user');
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
    const body = request.body;
    const { name, email, role, isDisabled } = await body.json();
    log.debug('Updating user');
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
    log.debug('Removing user');
    try {
      await UserService.removeUser(
        id as string,
      );
      response.status = Status.NoContent;
    } catch (e) {
      response.body = (e as Error).message;
      response.status = (e as { status: number }).status ||
        Status.InternalServerError;
    }
  }
}

export default UserController;
