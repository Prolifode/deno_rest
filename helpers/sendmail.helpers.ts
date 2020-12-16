import config from "../config/config.ts";
import type { IRequestBody } from "../deps.ts";
import { sendMail } from "../deps.ts";

class MailHelper {
  /**
   * Send a confirmation email to complete a registration
   * @param user
   * @param toEmail
   * @param token
   * @returns Promise<Payload | Error> Returns sendMail response
   */

  public static async sendConfirmationMail(
    user: string,
    toEmail: string,
    token: string,
  ) {
    const mail: IRequestBody = {
      personalizations: [
        {
          subject: "Confirmation your registration",
          to: [{ name: user, email: toEmail }],
        },
      ],
      from: { email: config.fromEmail },
      content: [
        {
          type: "text/html",
          value: `<h1>Hello ${user}</h1>
                <br>Please click on following link or Copy/Paste in your web browser to reset your password.
                <br><a href="http://domain.com/user/reset-password?reset=${token}">http://domain.com/user/reset-password?reset=${token}</a>`,
        },
      ],
    };

    return await sendMail(mail, { apiKey: "REDACTED" });
  }
}

export default MailHelper;
