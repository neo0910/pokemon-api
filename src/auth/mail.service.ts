import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendActivationMail(to: string, link: string): Promise<void> {
    await this.mailerService.sendMail({
      to,
      from: process.env.SMTP_USER,
      subject: `Account activation from ${process.env.API_URL}`,
      text: '',
      html: `<a href=${link}>Link</a>`,
    });
  }
}
