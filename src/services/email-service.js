import { createTransport } from "nodemailer";
import * as clientRaw from "../../client.json" assert {type: "json"};

export class EmailService {

  static get client() {
    return clientRaw.default;
  }

    static getDefaultTransporter() {
        return createTransport({
            service: 'gmail',
            auth: {
              type: 'OAuth2',
              user: this.client.mail_username,
              pass: this.client.mail_password,
              clientId: this.client.client_id,
              clientSecret: this.client.client_secret,
              refreshToken: this.client.refresh_token
            }
          })
    }

    static customTransporter(transporter) {
        return createTransport(transporter);
    }

}