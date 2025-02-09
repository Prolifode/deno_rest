import { compare, genSalt, hash } from 'jsr:@da/bcrypt';

class HashHelper {
  /**
   * Encrypts plain string and returns password hash
   * @param str
   * @returns Promise<string> Returns encrypted password hash
   */
  public static async encrypt(str: string): Promise<string> {
    const salt = await genSalt(8);
    return hash(str, salt);
  }

  /**
   * Compares hash
   * @param plain
   * @param _hash
   * @returns Promise<boolean> Returns Boolean if provided string and hash are equal
   */
  public static async compare(
    plain: string,
    _hash: string,
  ): Promise<boolean> {
    return await compare(plain, _hash);
  }
}

export default HashHelper;
