import configs from "../config/config.ts";
import { create, Header, Payload, Status, verify } from "../deps.ts";
import { throwError } from "../middlewares/errorHandler.middleware.ts";

const { jwtSecret } = configs;

const header: Header = {
  alg: "HS512",
  typ: "JWT",
};

class JwtHelper {
  /**
   * Generate JWT token
   * @param expires
   * @param id
   * @returns Promise<string> Returns JWT
   */
  public static getToken(
    expires: number,
    id?: string,
  ): Promise<string> {
    const payload: Payload = {
      iss: "djwt",
      iat: Date.now(),
      id,
      exp: Date.now() / 1000 + expires, // in seconds
    };

    return create(header, payload, jwtSecret);
  }

  /**
   * Validates JWT and returns JWT payload
   * @param token
   * @returns Promise<Payload | Error> Returns JWT payload
   */
  public static async getJwtPayload(token: string): Promise<Payload | Error> {
    try {
      return await verify(token, jwtSecret, "HS512");
    } catch (_e) {
      return throwError({
        status: Status.Unauthorized,
        name: "Unauthorized",
        path: "access_token",
        param: "access_token",
        message: `access_token is expired`,
        type: "Unauthorized",
      });
    }
  }
}

export default JwtHelper;
