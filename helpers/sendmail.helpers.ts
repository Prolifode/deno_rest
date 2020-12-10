import { IRequestBody, sendMail } from "../deps.ts";
import { from_email } from "./config/config.ts";

class MailHelper {
  /**
     * Send a confirmation email to complete a registration
     * @param user
     * @param to_email
     * @param token
     * @returns Promise<Payload | Error> Returns sendMail response
     */

  public static async sendConfirmationMail(
    user: string,
    to_email: string,
    token: string,
  ) {
    const mail: IRequestBody = {
      personalizations: [
        {
          subject: "Confirmation your registration",
          to: [{ name: user, email: to_email }],
        },
      ],
      from: { email: from_email },
      content: [
        {
          type: "text/html",
          value: `<h1>Hello ${user}</h1>
                <br>Please click on following link or Copy/Paste in your web browser to reset your password.
                <br><a href="http://domain.com/user/reset-password?reset=${token}">http://domain.com/user/reset-password?reset=${token}</a>`,
        },
      ],
    };

    const response = await sendMail(mail, { apiKey: "REDACTED" });

    return response;
  }
}

export default MailHelper;
