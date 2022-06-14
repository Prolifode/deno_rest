import { create, Status, verify } from "../deps.ts";
import type { Header, Payload } from "../deps.ts";
import { throwError } from "../middlewares/errorHandler.middleware.ts";

const key = await crypto.subtle.generateKey(
  { name: "HMAC", hash: "SHA-512" },
  true,
  ["sign", "verify"],
);

class JwtHelper {
  /**
   * Generate JWT token
   * @param exp Expiry
   * @param id
   * @returns String Returns JWT
   */
  public static getToken(
    exp: number,
    id: string,
  ): Promise<string> {
    const now = Date.now(); // in millis
    const header: Header = {
      alg: "HS512",
      typ: "JWT",
    };
    const payload: Payload = {
      iss: "deno_rest",
      iat: now,
      id,
      exp,
    };

    return create(header, payload, key);
  }

  /**
   * Validates JWT and returns JWT payload
   * @param token
   * @returns Promise<Payload | Error> Returns JWT payload
   */
  public static async getJwtPayload(token: string): Promise<Payload | Error> {
    try {
      return await verify(token, key);
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
