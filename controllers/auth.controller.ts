/**
 * Class AuthController
 *
 * This class is used to handle authentication-related tasks. It uses the AuthService class to perform
 * actual login and refresh token functionalities. This class acts as a controller layer between the
 * HTTP server and service layer, thereby reducing coupling between these two layers.
 *
 * @import { RouterContext } - This is a type imported from the `deps.ts` file, used to denote the context in which the router operates.
 * @import log - This is a logger middleware imported from the `logger.middleware.ts` file. It's used to log debug information.
 * @import AuthService - This is a service class imported from the `auth.service.ts` file. It's used to perform authentication-related tasks like login and refreshing tokens.
 *
 * @method login() - An asynchronous method that extracts 'email' and 'password' from the request body, logs the login attempt,
 * then delegates the login functionality to the AuthService.login() method.
 *
 * @method refreshTokens() - An asynchronous method that extracts 'refreshToken' from the request body, logs the token refresh attempt,
 * then delegates the token refresh functionality to the AuthService.getRefreshToken() method.
 *
 * @exports AuthController - This class is exported for use in other parts of the application.
 */
import type { RouterContext } from 'jsr:@oak/oak';
import log from '../middlewares/logger.middleware.ts';
import AuthService from '../services/auth.service.ts';

class AuthController {
  /**
   * This method handles the login operation.
   * It retrieves the user's email and password from the request body,
   * logs the login attempt and returns the AuthService.login() result.
   *
   * @async
   * @param {RouterContext<string>} request - The request object, which contains the user's email and password.
   * @param {RouterContext<string>} response - The response object, where the login result will be stored.
   * @returns {Promise<void>} - The Promise object represents the result of the login operation.
   */
  public static async login(
    { request, response }: RouterContext<string>,
  ): Promise<void> {
    const body = request.body;
    const { email, password } = await body.json();
    log.debug('Trying Login user');
    response.body = await AuthService.login({ email, password });
  }

  /**
   * This method handles the token refresh operation.
   * It retrieves the refresh token from the request body, logs the action and returns the AuthService.getRefreshToken() result.
   *
   * @async
   * @param {RouterContext<string>} request - The request object, which contains the refresh token.
   * @param {RouterContext<string>} response - The response object, where the token refresh result will be stored.
   * @returns {Promise<void>} - The Promise object represents the result of the refresh token operation.
   */
  public static async refreshTokens(
    { request, response }: RouterContext<string>,
  ): Promise<void> {
    const body = request.body;
    const { refreshToken } = await body.json();
    log.debug('Getting refresh token');
    response.body = await AuthService.getRefreshToken(refreshToken);
  }
}

/**
 * Exporting the AuthController module.
 *
 * @exports AuthController
 */
export default AuthController;
