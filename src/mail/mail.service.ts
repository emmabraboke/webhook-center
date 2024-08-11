import { Injectable } from '@nestjs/common';
import Mailgun from 'mailgun.js';
import * as formData from 'form-data';
import { Config } from '../config/config';
import { SendEmailDto, SendPasswordResetEmailDto } from './dto/mail.dto';

@Injectable()
export class MailService {
  private mailgun;
  constructor() {
    const mailgun = new Mailgun(formData);
    this.mailgun = mailgun.client({
      username: 'api',
      key: Config.mailgunApiKey,
    });
  }

  private async sendMail(data: SendEmailDto): Promise<true> {
    data.from = Config.mailgunFrom;

    await this.mailgun.messages.create(Config.mailgunDomain, data);

    return true;
  }

  async sendVerificationEmail(email: string, token: string) {}

  async sendPasswordResetEmail(
    dto: SendPasswordResetEmailDto,
  ): Promise<boolean> {
    const { otp, email } = dto;

    const mailOptions = {
      to: [email],
      subject: 'Password Reset',
      html: `<p>Hi,</p>
      <p>Please use the following OTP to reset your password:</p>
      <h3>${otp}</h3>
      <p>Regards,</p> 
      <p>Team</p>`,
    };

    await this.sendMail(mailOptions);

    return true;
  }
}
