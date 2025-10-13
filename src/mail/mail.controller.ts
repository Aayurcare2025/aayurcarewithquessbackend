import { Controller, Post, Body } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('send')
  async sendMail(@Body() body: { name: string; email: string; phone: string; comment: string }) {
    const { name, email, phone, comment } = body;
    await this.mailService.sendMail(name, email, phone, comment);
    return { message: 'Mail sent successfully!' };
  }
}
