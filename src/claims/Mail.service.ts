// // import { Injectable } from '@nestjs/common';
// // import * as nodemailer from 'nodemailer';

// // @Injectable()
// // export class MailService {
// // //   private transporter = nodemailer.createTransport({
// // //     service: 'Godaddy',
// // //     auth: {
// // //       user: process.env.GODADDY_EMAIL_USER, 
// // //       pass: process.env.GODADDY_EMAIL_PASS, 
// // //     },
// // //   });


// // private transporter = nodemailer.createTransport({
// //   host: "smtpout.secureserver.net",
// //   port: 465,
// //   secure: true,
// //   auth: {
// //     user: process.env.GODADDY_EMAIL_USER,
// //     pass: process.env.GODADDY_EMAIL_PASS,
// //   },


// // });




// //   async sendFileMail(to: string, subject: string, text: string, file: Express.Multer.File) {
// //     await this.transporter.sendMail({
// //       from: process.env.GODADDY_EMAIL_USER,
// //       to,
// //       subject,
// //       text,
// //       attachments: [
// //         {
// //           filename: file.originalname,
// //           content: file.buffer,      // <-- Send RAW BUFFER
// //         },
// //       ],
// //     });
// //   }
// // }



// import { Injectable } from '@nestjs/common';
// import * as nodemailer from 'nodemailer';

// @Injectable()
// export class MailService {
//   private transporter = nodemailer.createTransport({
//     host: "smtpout.secureserver.net",
//     port: 465,
//     secure: true,
//     auth: {
//       user: process.env.GODADDY_CLAIMS_EMAIL,
//       pass: process.env.GODADDY_CLAIMS_EMAIL_PASS,
//     },
//   });

//   // Original method - single file
//   async sendFileMail(
//     to: string,
//     subject: string,
//     text: string,
//     file: Express.Multer.File
//   ) {
//     await this.transporter.sendMail({
//       from: process.env.GODADDY_CLAIMS_EMAIL,
//       to,
//       subject,
//       text,
//       attachments: [
//         {
//           filename: file.originalname,
//           content: file.buffer,
//         },
//       ],
//     });
//   }

//   // NEW method - multiple files in ONE email
//   async sendMultipleFilesMail(
//     to: string,
//     subject: string,
//     text: string,
//     files: Express.Multer.File[]
//   ) {
//     // Convert all files to attachments array
//     const attachments = files.map((file) => ({
//       filename: file.originalname,
//       content: file.buffer,
//     }));  

//     await this.transporter.sendMail({
//       from: process.env.GODADDY_CLAIMS_EMAIL,
//       to,
//       subject,
//       text,
//       attachments, // All files attached to ONE email
//     });

//     console.log(`✅ Email sent with ${files.length} attachments`);
//   }
// }




import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    host: "smtpout.secureserver.net",
    port: 465,
    secure: true,
    auth: {
      user: process.env.GODADDY_EMAIL_USER,
      pass: process.env.GODADDY_EMAIL_PASS,
    },
  });

  // Original method - single file
  async sendFileMail(
    to: string,
    subject: string,
    text: string,
    file: Express.Multer.File
  ) {
    await this.transporter.sendMail({
      from: process.env.GODADDY_EMAIL_USER,
      to,
      subject,
      text,
      attachments: [
        {
          filename: file.originalname,
          content: file.buffer,
        },
      ],
    });
  }

  // NEW method - multiple files in ONE email
  async sendMultipleFilesMail(
    to: string,
    subject: string,
    text: string,
    files: Express.Multer.File[]
  ) {
    // Convert all files to attachments array
    const attachments = files.map((file) => ({
      filename: file.originalname,
      content: file.buffer,
    }));

    await this.transporter.sendMail({
      from: process.env.GODADDY_EMAIL_USER,
      to,
      subject,
      text,
      attachments, 
    });

    console.log(`✅ Email sent with ${files.length} attachments`);
  }


     async sendClaimSubmittedMail(userEmail: string) {
    const message = `
Dear Customer,
 
Greetings from AayurCare.
 
This is to acknowledge receipt of your claim submission. We confirm that your request has been successfully received and is currently under review.
 
The claim will be processed within 7 to 10 working days. In case any additional information or documentation is required, our team will contact you in due course.
 
Thank you for your cooperation.
 
Warm regards,
AayurCare Claims Team
    `.trim();

    await this.transporter.sendMail({
      from: process.env.GODADDY_CLAIMS_EMAIL, // FROM claims mail
      to: userEmail,                         // ✅ USER email
      subject: "Claim Submitted Successfully",
      text: message,
    });

    console.log(`✅ Claim confirmation mail sent to ${userEmail}`);
  }




}