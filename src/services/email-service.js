import { createTransport } from "nodemailer";

export class EmailService {

  static customTransporter(transporter) {
      return createTransport(transporter);
  }

}