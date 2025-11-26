import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
//   private transporter = nodemailer.createTransport({
//     service: 'Godaddy',
//     auth: {
//       user: process.env.GODADDY_EMAIL_USER, 
//       pass: process.env.GODADDY_EMAIL_PASS, 
//     },
//   });


private transporter = nodemailer.createTransport({
  host: "smtpout.secureserver.net",
  port: 465,
  secure: true,
  auth: {
    user: process.env.GODADDY_EMAIL_USER,
    pass: process.env.GODADDY_EMAIL_PASS,
  },


});




  async sendFileMail(to: string, subject: string, text: string, file: Express.Multer.File) {
    await this.transporter.sendMail({
      from: process.env.GODADDY_EMAIL_USER,
      to,
      subject,
      text,
      attachments: [
        {
          filename: file.originalname,
          content: file.buffer,      // <-- Send RAW BUFFER
        },
      ],
    });
  }
}
