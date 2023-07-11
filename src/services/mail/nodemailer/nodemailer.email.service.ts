import { Injectable } from '@nestjs/common';
import { createTransport, Transporter, SendMailOptions } from 'nodemailer';
import { IEmailService } from '../../../core/interfaces/email.inteface';

@Injectable()
export class NodemailerEmailService implements IEmailService {
  transporter: Transporter;

  constructor() {
    this.transporter = createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async sendEmail(to: string, subject: string, text: string): Promise<boolean> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const mailOptions: SendMailOptions = {
      from: process.env.EMAIL_ADDRESS, // sender address
      to: to,
      subject: subject,
      text: text,
    };

    // Commented bacause is dummy function for test.
    // try {
    //   await this.transporter.sendMail(mailOptions);
    //   return Promise.resolve(true);
    // } catch (error) {
    //   return Promise.resolve(false);
    // }

    return Promise.resolve(true);
  }
}
