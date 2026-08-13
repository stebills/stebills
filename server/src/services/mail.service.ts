import Mailer, { Transporter } from 'nodemailer';

interface IEmailSender {
  send(toEmail: string, subject: string, message: string): Promise<void>;
}

class EmailSender implements IEmailSender {
  transporter: Transporter;

  SENDER_EMAIL: string;

  MAIL_FROM_NAME = 'stebills';

  constructor(SENDER_EMAIL: any, SENDER_PASSWORD: any) {
    const AUTH = {
      user: SENDER_EMAIL,
      pass: SENDER_PASSWORD,
    };

    this.transporter = Mailer.createTransport({
      service: 'gmail',
      auth: AUTH,
    });

    this.SENDER_EMAIL = SENDER_EMAIL;
  }

  async send(toEmail: string, subject: string, message: string): Promise<void> {
    const FROM_MAIL_INFO = {
      name: this.MAIL_FROM_NAME,
      address: this.SENDER_EMAIL,
    };

    this.transporter.sendMail({
      from: FROM_MAIL_INFO,
      to: toEmail,
      subject,
      text: message,
    });
  }
}

export default EmailSender;