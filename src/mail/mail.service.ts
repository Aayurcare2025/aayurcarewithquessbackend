  // import { Injectable } from '@nestjs/common';
  // import * as nodemailer from 'nodemailer';
  // import * as dotenv from 'dotenv';
  // dotenv.config();

  // @Injectable()
  // export class MailService {
  //   private transporter;

  //   constructor() {
  //     this.transporter = nodemailer.createTransport({
  //       host: process.env.EMAIL_HOST,
  //       port: 587,
  //       secure: false, // ✅ false for port 587
  //       auth: {
  //         user: process.env.EMAIL_USER,
  //         pass: process.env.EMAIL_PASS,
  //       },
  //       tls: {
  //         rejectUnauthorized: false, // ✅ allow GoDaddy SSL handshake
  //       },
  //     });
  //   }

  //   async sendMail(name: string, email: string, phone: string, comment: string) {
  //     const htmlContent = `
  //       <h2>New Contact Form Submission</h2>
  //       <p><b>Name:</b> ${name}</p>
  //       <p><b>Email:</b> ${email}</p>
  //       <p><b>Phone:</b> ${phone}</p>
  //       <p><b>Comment:</b> ${comment}</p>
  //     `;

  //     await this.transporter.sendMail({
  //       from: `"AayurCare Website" <${process.env.EMAIL_USER}>`,
  //       to: process.env.EMAIL_TO,
  //       subject: `New Contact Message from ${name}`,
  //       html: htmlContent,
  //     });
  //   }
  // }


  import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: false, // ✅ false for port 587
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // ✅ Verify SMTP connection at startup
    this.transporter.verify((error, success) => {
      if (error) {
        this.logger.error('SMTP connection failed:', error.message);
      } else {
        this.logger.log('SMTP connection established successfully!');
      }
    });
  }

  async sendMail(name: string, email: string, phone: string, comment: string) {
    const htmlContent = `
      <h2>New Contact Form Submission</h2>
      <p><b>Name:</b> ${name}</p>
      <p><b>Email:</b> ${email}</p>
      <p><b>Phone:</b> ${phone}</p>
      <p><b>Comment:</b> ${comment}</p>
    `;

    try {
      const info = await this.transporter.sendMail({
        from: `"AayurCare Website" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_TO,
        subject: `New Contact Message from ${name}`,
        html: htmlContent,
      });

      this.logger.log(`✅ Mail sent successfully to ${process.env.EMAIL_TO}`);
      this.logger.debug('Mail info: ' + JSON.stringify(info));
      return info;

    } catch (error) {
      this.logger.error('❌ Failed to send email: ' + error.message);
      if (error.response) {
        this.logger.error('SMTP Response: ' + error.response);
      }
      throw error;
    }
  }
}
