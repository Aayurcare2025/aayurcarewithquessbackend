// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import * as crypto from 'crypto';
// import { Payment } from './payment.entity';
// import { Between, Repository } from 'typeorm';
// import { Cron, CronExpression } from '@nestjs/schedule';
// import { createObjectCsvWriter } from 'csv-writer';
// import * as fs from 'fs';
// import * as nodemailer from 'nodemailer';
// import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
// @Injectable()
// export class PayuService {

//   constructor(
//     // Inject payment repository here for saving payment records
//     @InjectRepository(Payment)
//     private readonly paymentRepo: Repository<Payment>,
//   ) {}

//   private key = process.env.PAYU_KEY;
//   private salt = process.env.PAYU_SALT;
//   private payuUrl = process.env.PAYU_BASE_URL ;

//   // ✅ Step 1: Generate hash for transaction (exact PayU format)
//  generateHash(data: any): string {
//   const hashString =
//     `${this.key}|${data.txnid}|${data.amount}|${data.productinfo}` +
//     `|||||||||||||${this.salt}`;
    
//   console.log("Correct PayU Hash String:", hashString);

//   return crypto.createHash('sha512').update(hashString).digest('hex');
// }

//   // ✅ Step 2: Prepare payment initiation data
//   async initiatePayment(paymentData: any) {
//     const hash = this.generateHash(paymentData);
//     return {
//       ...paymentData,
//       key: this.key,
//       hash,
//       payuUrl: this.payuUrl + '/_payment',
//     };



//   }

//   // ✅ Step 3: Verify PayU callback hash
// verifyHash(response: any): boolean {
//   const hashString = `${this.salt}|${response.status}|||||||||||${response.productinfo}|${response.amount}|${response.txnid}|${this.key}`;

//   const hash = crypto.createHash('sha512').update(hashString).digest('hex');
//   return hash === response.hash;
// }
//  async savePayment(data: any) {
//     const payment = this.paymentRepo.create({
//       firstname: data.firstname,
//       email: data.email,
//       phone: data.phone,
//       amount: data.amount,
//       txnid: data.txnid,
//       productinfo: data.productinfo,
//       status: "Success",
//       payment_date: new Date(),


//     });


//     // const saved=await this.paymentRepo.save(payment);

//     // const applicant=await this.getApplicantFromDB(data.applicant_id)
    
//     //   if (applicant) {
//     // applicant.membership_id = this.generateMembershipId(applicant.applicant_id);
//     // applicant.virtual_card_number = this.generateVirtualCardId(
//     //   applicant.applicant_id,
//     //   applicant.dob
//     // );

//     // Generate PDF card
//     // const fileName = await this.generateCardPdf(applicant);
//     // console.log("fileName",fileName);

         
//     // Optionally email the PDF to customer
//   //   await this.sendCardEmail(applicant.email, fileName);
//   // }

// // return saved;


//     return this.paymentRepo.save(payment);




// }

// //get today's payment


// async getTodayPayments() {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     const tomorrow = new Date(today);
//     tomorrow.setDate(today.getDate() + 1);

//     return this.paymentRepo.find({
//       where: {
//         payment_date: Between(today, tomorrow),
//       },
//     });



//   }


//   // -----------------------------------------------------
//   @Cron(CronExpression.EVERY_DAY_AT_9AM)
//   async sendDailyReport() {
//     const payments = await this.getTodayPayments();

//     if (payments.length === 0) {
//       console.log("No payments today");
//       return;
//     }

//     const filename = `payments-${Date.now()}.csv`;

//     await this.generateCSV(filename, payments);

//     await this.sendEmail(filename);

//     fs.unlinkSync(filename);
//   }




//     async generateCSV(filename: string, data: any[]) {
//     const csvWriter = createObjectCsvWriter({
//       path: filename,
//       header: [
//         { id: 'firstname', title: 'First Name' },
//         { id: 'email', title: 'Email' },
//         { id: 'phone', title: 'Phone' },
//         { id: 'amount', title: 'Amount' },
//         { id: 'txnid', title: 'Transaction ID' },
//         { id: 'productinfo', title: 'Product' },
//         { id: 'payment_date', title: 'Payment Date' },
//       ],
//     });

//     await csvWriter.writeRecords(data);
//   }



//    async sendEmail(filename: string) {
//     const transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: process.env.SUPPORT_EMAIL,
//         pass: process.env.SUPPORT_EMAIL_PASS,
//       },
//     });

//     await transporter.sendMail({
//       from: process.env.SUPPORT_EMAIL,
//       to: "contact@aayurcare.com",
//       subject: "Daily Payment Report",
//       text: "Attached today’s payment report.",
//       attachments: [
//         { filename, path: `./${filename}` },
//       ],
//     });
    
//   console.log("Daily Report Sent!");



//   }


// async getApplicantFromDB(applicantId: string) {
//   return await this.paymentRepo.manager.getRepository("Applicant").findOne({
//     where: { applicant_id: applicantId }
//   });
// }

// //from v
// generateVirtualCardId(applicantId: string,dob:string) {
//   applicantId = applicantId.toString();
//   const first2 = applicantId.slice(0, 2);
//   const first4 = applicantId.slice(0, 4);
//   const last4 = applicantId.slice(-4);

//   const now = new Date(dob);
//   const YY = now.getFullYear().toString().slice(-2);
//   const DD = now.getDate().toString().padStart(2, "0");

//   return `AQ${first2}-${first4}-${last4}-${YY}${DD}`;
// }



// generateMembershipId(applicantId: string) {
//   return "AQ" + applicantId.toString().slice(0, 2);
// }








// async generateCardPdf(applicant: any) {

//   const pdfDoc = await PDFDocument.create();

//   const page1 = pdfDoc.addPage([243,153]);

//   const page2 = pdfDoc.addPage([243,153]);

//   const frontImageBytes = fs.readFileSync('./FrontQuess.png');
//   const backImageBytes  = fs.readFileSync('./BackQuess.png');

//   const frontImg = await pdfDoc.embedPng(frontImageBytes);
//   const backImg  = await pdfDoc.embedPng(backImageBytes);


//   page1.drawImage(frontImg, { x: 0, y: 0, width: 243, height: 153 });

//   const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

//   page1.drawText(applicant.firstname, { x: 20, y:15, size: 14, font, color: rgb(1,1,1) });
//   page1.drawText(applicant.virtual_card_number, { x: 20, y: 70, size: 14, font, color: rgb(1,1,1) });
//  page1.drawText(applicant.month, { x: 110, y:50, size: 7, font, color: rgb(1,1,1) });
//   page1.drawText(applicant.year, { x: 130, y: 50, size: 7, font, color: rgb(1,1,1) });
//   page2.drawImage(backImg, { x: 0, y: 0, width: 243, height: 153 });

  
//   page2.drawText(applicant.firstname, { x: 35, y: 45, size: 6, font, color: rgb(1,1,1) });
//   page2.drawText(applicant.dob, { x: 134, y: 45, size: 6, font, color: rgb(1,1,1) });
//   page2.drawText(applicant.membership_id, { x: 178, y: 45, size: 6, font, color: rgb(1,1,1) });

//   const pdfBytes = await pdfDoc.save();

//   const fileName = `Card-${applicant.applicant_id}.pdf`;

//   fs.writeFileSync(fileName, pdfBytes);

//   console.log("PDF generated:", fileName);
// }





// async sendCardEmail(email: string, fileName: string) {
//   const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: process.env.SUPPORT_EMAIL,
//       pass: process.env.SUPPORT_EMAIL_PASS,
//     },
//   });

//   await transporter.sendMail({
//     from: process.env.SUPPORT_EMAIL,
//     to: email,
//     subject: "Your Aayur Care Membership Card",
//     text: "Attached is your membership card PDF.",
//     attachments: [
//       { filename: fileName, path: `./${fileName}` }
//     ],
//   });

//   console.log("Membership card sent to:", email);
// }


// }


import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as crypto from 'crypto';
import { Payment } from './payment.entity';
import { Between, Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { createObjectCsvWriter } from 'csv-writer';
import * as fs from 'fs';
import { Applicant } from 'src/Api/dash.entity';
import * as nodemailer from 'nodemailer';
import path from 'path';
// import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

@Injectable()
export class PayuService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,

  
  ) {}

  private key = process.env.PAYU_KEY;
  private salt = process.env.PAYU_SALT;
  private payuUrl = process.env.PAYU_BASE_URL;

  // ---------------- HASHING ----------------
  // generateHash(data: any): string {
  //   const hashString =
  //     `${this.key}|${data.txnid}|${data.amount}|${data.productinfo}` +
  //     `|||||||||||||${this.salt}`;

  //   return crypto.createHash('sha512').update(hashString).digest('hex');
  // }


//   generateHash(data: any): string {
//   const hashString =
//     `${this.key}|${data.txnid}|${data.amount}|${data.productinfo}|` +
//     `${data.firstname}|${data.email}|||||||||||${this.salt}`;

//   console.log("HASH STRING SENT TO PAYU ===>\n", hashString);

//   return crypto.createHash('sha512').update(hashString).digest('hex');
// }


// generateHash(data: any): string {
//   const hashString =
//     `${this.key}|${data.txnid}|${data.amount}|${data.productinfo}|` +
//     `${data.firstname}|${data.email}|${data.udf1}|||||||||${this.salt}`;

//   return crypto.createHash('sha512').update(hashString).digest('hex');
// }

// generateHash(data: any): string {
//   const hashString =
//     `${this.key}|${data.txnid}|${data.amount}|${data.productinfo}|` +
//     `${data.firstname}|${data.email}|${data.udf1}|||||||${this.salt}`;

//   console.log("PAYU HASH STRING:", hashString);

//   return crypto
//     .createHash('sha512')
//     .update(hashString)
//     .digest('hex');
// }
// generateHash(data: any): string {
//   const hashString =
//     `${this.key}|${data.txnid}|${data.amount}|${data.productinfo}|` +
//     `${data.firstname}|${data.email}|${data.udf1 || ''}|` +
//     `|||||` +   // udf2–udf5
//     `||||||` +  // remaining empty fields
//     `${this.salt}`;

//   console.log("PAYU HASH STRING:", hashString);

//   return crypto
//     .createHash('sha512')
//     .update(hashString)
//     .digest('hex');
// }


// generateHash(data: any): string {
//   const hashString =
//     `${this.key}|${data.txnid}|${data.amount}|${data.productinfo}|` +
//     `${data.firstname}|${data.email}|${data.udf1 || ''}|||||||||` + // exactly 9 pipes after udf1
//     `${this.salt}`;

//   console.log("PAYU HASH STRING:", hashString);

//   return crypto.createHash('sha512').update(hashString).digest('hex');
// }




// generateHash(data: any): string {
//   const hashString =
//     `${this.key}|${data.txnid}|${Number(data.amount).toFixed(2)}|${data.productinfo}|` +
//     `${data.firstname}|${data.email}|${data.udf1}|||||||||${this.salt}`;

//   console.log("PAYU HASH STRING:", hashString);

//   return crypto.createHash('sha512').update(hashString).digest('hex');
// }



// generateHash(data: any): string {
//   const hashString =
//     `${this.key}|${data.txnid}|${Number(data.amount).toFixed(2)}|${data.productinfo}|` +
//     `${data.firstname}|${data.email}|` +
//     `${data.udf1 || ''}|||||||||` + // ⚠️ EXACT pipes
//     `${this.salt}`;

//   console.log("✅ PAYU HASH STRING:", hashString);

//   return crypto
//     .createHash('sha512')
//     .update(hashString)
//     .digest('hex');
// }


// generateHash(data: any): string {
//   // Ensure amount is formatted correctly
//   const amount = Number(data.amount).toFixed(2);
  
//   // const hashString =
//   //   `${this.key}|${data.txnid}|${amount}|${data.productinfo}|` +
//   //   `${data.firstname}|${data.email}|` +
//   //   `${data.udf1 || ''}|${data.udf2 || ''}|${data.udf3 || ''}|${data.udf4 || ''}|${data.udf5 || ''}|` +
//   //   `||||||` + // udf6-udf10 (6 more pipes)
//   //   `${this.salt}`;
//  const hashString =
//     `${this.key}|${data.txnid}|${amount}|${data.productinfo}|` +
//     `${data.firstname}|${data.email}|` +
//     `${data.udf1 || ''}|${data.udf2 || ''}|${data.udf3 || ''}|${data.udf4 || ''}|${data.udf5 || ''}|` +
//     `||||||` +
//     `${this.salt}`;
// console.log(" HASH STRING FOR PAYU:");
//   console.log(hashString);
//   console.log(" KEY:", this.key);
//   console.log("SALT:", this.salt);

//   const hash= crypto
//     .createHash('sha512')
//     .update(hashString)
//     .digest('hex');
//      console.log("GENERATED HASH:", hash);
//      return hash;
// }


// generateHash(data: any): string {
//   const amount = Number(data.amount).toFixed(2);

//   const hashString =
//     `${this.key}|${data.txnid}|${amount}|${data.productinfo}|` +
//     `${data.firstname}|${data.email}|` +
//     `${data.udf1 || ''}|${data.udf2 || ''}|${data.udf3 || ''}|${data.udf4 || ''}|${data.udf5 || ''}|` +
//     `|||||` +   // ✅ ONLY 5 pipes (udf6–udf10)
//     `${this.salt}`;

//   console.log("✅ PAYU HASH STRING:", hashString);

//   return crypto
//     .createHash('sha512')
//     .update(hashString)
//     .digest('hex');
// }



generateHash(data: any): string {
  const amount = Number(data.amount).toFixed(2);

  const hashString =
    `${this.key}|${data.txnid}|${amount}|${data.productinfo}|` +
    `${data.firstname}|${data.email}|` +
    `${data.udf1 || ''}|${data.udf2 || ''}|${data.udf3 || ''}|${data.udf4 || ''}|${data.udf5 || ''}|` +
    `${''}|${''}|${''}|${''}|${''}|` +   // udf6–udf10 EXACT
    `${this.salt}`;

  console.log("✅ PAYU HASH STRING:", hashString);

  return crypto
    .createHash('sha512')
    .update(hashString)
    .digest('hex');
}






  async initiatePayment(paymentData: any) {

    const hash = this.generateHash(paymentData);
    return {
      ...paymentData,
      key: this.key,
      hash,
      payuUrl: this.payuUrl + '/_payment',
    };
  }

  // verifyHash(response: any): boolean {
  //   const hashString = `${this.salt}|${response.status}|||||||||||${response.productinfo}|${response.amount}|${response.txnid}|${this.key}`;
  //   const hash = crypto.createHash('sha512').update(hashString).digest('hex');
  //   return hash === response.hash;
  // }

//   verifyHash(response: any): boolean {
//   const hashString =
//     `${this.salt}|${response.status}` +
//     `|||||||||||${response.email}|${response.firstname}|${response.productinfo}|` +
//     `${response.amount}|${response.txnid}|${this.key}`;

//   const calculated = crypto.createHash("sha512")
//     .update(hashString)
//     .digest("hex");

//   console.log("VERIFY HASH STRING ===>\n", hashString);
//   console.log("PAYU SENT HASH ===>", response.hash);
//   console.log("OUR CALCULATED HASH ===>", calculated);

//   return calculated === response.hash;  


// }



// verifyHash(response: any): boolean {
//   const hashString =
//     `${this.salt}|${response.status}` +
//     `|||||||||${response.udf1}|${response.email}|${response.firstname}|` +
//     `${response.productinfo}|${response.amount}|${response.txnid}|${this.key}`;

//   const calculated = crypto
//     .createHash('sha512')
//     .update(hashString)
//     .digest('hex');

//   return calculated === response.hash;
// }



// verifyHash(response: any): boolean {
//   const hashString =
//     `${this.salt}|${response.status}` +
//     `|||||||||${response.udf1}|${response.email}|${response.firstname}|` +
//     `${response.productinfo}|${response.amount}|${response.txnid}|${this.key}`;

//   const calculated = crypto
//     .createHash('sha512')
//     .update(hashString)
//     .digest('hex');

//   return calculated === response.hash;
// }

// verifyHash(response: any): boolean {
//   const hashString =
//     `${this.salt}|${response.status}` +
//     `|||||||||${response.udf1}|${response.email}|${response.firstname}|` +
//     `${response.productinfo}|${response.amount}|${response.txnid}|${this.key}`;

//   console.log("PAYU RESPONSE HASH STRING:", hashString);
//   console.log("PAYU HASH:", response.hash);

//   const calculated = crypto
//     .createHash('sha512')
//     .update(hashString)
//     .digest('hex');

//   console.log("CALCULATED HASH:", calculated);

//   return calculated === response.hash;
// }


verifyHash(response: any): boolean {
  const amount = Number(response.amount).toFixed(2);
  
  const hashString =
    `${this.salt}|${response.status}|` +
    `||||||` + // udf6-udf10
    `${response.udf5 || ''}|${response.udf4 || ''}|${response.udf3 || ''}|${response.udf2 || ''}|${response.udf1 || ''}|` +
    `${response.email}|${response.firstname}|` +
    `${response.productinfo}|${amount}|${response.txnid}|${this.key}`;

  console.log("VERIFY HASH STRING:", hashString);

  const calculated = crypto
    .createHash('sha512')
    .update(hashString)
    .digest('hex');

  console.log("PAYU HASH:", response.hash);
  console.log("CALCULATED:", calculated);

  return calculated === response.hash;
}






  // ---------------- SAVE PAYMENT ----------------
  async savePayment(data: any) {
    // const payment = this.paymentRepo.create({
    //   first_name: data.first_name,
    //   email_id: data.email_id,
    //   contact_no: data.contact_no,
    //   amount: data.amount,
    //   txnid: data.txnid,
    //   productinfo: data.productinfo,
    //   status: "Success",
    //   payment_date: new Date(),
    // });


    const applicant=await this.getApplicantFromDB(data.applicant_id);

    if (!applicant) {
    console.log("applicant id not found");
  }

    
  const payment = this.paymentRepo.create({
    first_name: applicant?.first_name,
    email: data.email,
    contact_no: applicant?.contact_no,
    amount: data.amount,
    txnid: data.txnid,
    productinfo: data.productinfo,
    status: "Success",
    payment_date: new Date(),
  });

    const saved = await this.paymentRepo.save(payment);

    await this.sendStyledEmail(data.email,data.amount);


    // FETCH applicant only for data (not storing anything)
    
    // const applicant = await this.getApplicantFromDB(data.applicant_id);

    // if (applicant) {
    //   // Generate values dynamically
    //   const membership_id = this.generateMembershipId(applicant.applicant_id);
    //   const virtual_card_number = this.generateVirtualCardId(
    //     applicant.applicant_id,
    //     applicant.dob
    //   );
    //   const bottomvalue = this.generateBottomValue(applicant.applicant_id);
    //   const { month, year } = this.getExpiryMonthYear();

      // await this.generateCardPdf({
      //   ...applicant,
      //   membership_id,
      //   virtual_card_number,
      //   bottomvalue,
      //   month,
      //   year
      // });


//       await this.generateCardPdf({
//   applicant_id: applicant.applicant_id,
//   firstname: applicant.first_name ?? "",
//   lastname: applicant.last_name ?? "",
//   dob: applicant.DOB ?? "",
//   email: applicant.email_id ?? "",
//   phone: applicant.contact_no ?? "",
//   membership_id,
//   virtual_card_number,
//   bottomvalue,
//   month,
//   year
// });


    //   await this.sendCardEmail(applicant.email, `Card-${applicant.applicant_id}.pdf`);
    // }

    return saved;
  }


async sendStyledEmail(toEmail: string,amount:number) {
  const transporter = nodemailer.createTransport({
    host: "smtpout.secureserver.net",
    port: 465,
    secure: true,
    auth: {
      // user: "no-reply@aayurcare.com",
      // pass: "Aayurcare@2025!noreply"
      user:process.env.GODADDY_NO_REPLY_MAIL,
      pass:process.env.GODADDY_NO_REPLY_PASSWORD
    },
  });


  let imagePath="";



  if(amount==200)
  {
  // imagePath="src/Payment/plan200.jpg"
  imagePath = path.join(__dirname, 'plan200.jpg');

  }
  else if(amount==400)
  {
    // imagePath="src/Payment/plan400.jpg"
    imagePath = path.join(__dirname, 'plan400.jpg');
  }
  const htmlContent = `
    <div style="width:100%; text-align:center; font-family:Arial;">
        <img src="cid:banner" style="width:100%; max-width:600px;" />
    </div>
  `;

  await transporter.sendMail({
    from: `AayurCare <no-reply@aayurcare.com>`,
    to: toEmail,
    subject: "Payment Successful for Aayur Enterprises",
    html: htmlContent,
    attachments: [
      {
        filename: "payment.jpg",
        path: imagePath, 
        cid: "banner"
      }
    ],
  });

  console.log("Styled email sent to: ", toEmail);
}



  // ---------------- GET TODAY PAYMENT ----------------
  async getTodayPayments() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);  

    return this.paymentRepo.find({
      where: { payment_date: Between(today, tomorrow) },
    });
  }

  // ----------------- DAILY CRON -----------------
  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async sendDailyReport() {
    const payments = await this.getTodayPayments();
    if (payments.length === 0) return;
    const filename = `payments-${Date.now()}.csv`;
    await this.generateCSV(filename, payments);
    // await this.sendEmail(filename);
    fs.unlinkSync(filename);
  }

  async generateCSV(filename: string, data: any[]) {
    const csvWriter = createObjectCsvWriter({
      path: filename,
      header: [
        { id: 'firstname', title: 'First Name' },
        { id: 'email', title: 'Email' },
        { id: 'phone', title: 'Phone' },
        { id: 'amount', title: 'Amount' },
        { id: 'txnid', title: 'Transaction ID' },
        { id: 'productinfo', title: 'Product' },
        { id: 'payment_date', title: 'Payment Date' },
      ],
    });

    await csvWriter.writeRecords(data);
  }

  // async sendEmail(filename: string) {
  //   const transporter = nodemailer.createTransport({
  //     host: "smtpout.secureserver.net",
  // port: 465,
  // secure: true, // use SSL
  // auth: {
  //   user: process.env.GODADDY_CONTACT_EMAIL_USER,
  //   pass: process.env.GODADDY_CONTACT_EMAIL_PASS,
  // },
  //   });

  //   await transporter.sendMail({
  //     from: process.env.SUPPORT_EMAIL,
  //     to: "contact@aayurcare.com",
  //     subject: "Daily Payment Report",
  //     text: "Attached today’s payment report.",
  //     attachments: [{ filename, path: `./${filename}` }],
  //   });
  // }

  // ----------------- FETCH APPLICANT -----------------


  async getApplicantFromDB(applicantId: string) {
    return await this.paymentRepo.manager
      // .getRepository("applicant")
      .getRepository(Applicant)
      .findOne({ where: { applicant_id: applicantId } });
  }

  


  

  
  // ---------------- GENERATORS ----------------

  //
  // generateVirtualCardId(applicantId: string, dob: string) {
  //   applicantId = applicantId.toString();
  //   const first2 = applicantId.slice(0, 2);
  //   const first4 = applicantId.slice(0, 4);
  //   const last4 = applicantId.slice(-4);

  //   const d = new Date(dob);
  //   const YY = d.getFullYear().toString().slice(-2);
  //   const DD = d.getDate().toString().padStart(2, "0");

  //   return `AQ${first2}-${first4}-${last4}-${YY}${DD}`;
  // }

  // generateMembershipId(applicantId: string) {
  //   return "AQ" + applicantId.toString().slice(0, 2);
  // }

  // generateBottomValue(applicantId: string) {
  //   return "ACHB" + applicantId.toString().padStart(6, "0");
  // }

  // --------- EXPIRY MONTH/YEAR (1 MONTH PLAN) ----------
  // getExpiryMonthYear() {
  //   const today = new Date();
  //   const expiry = new Date(today);
  //   expiry.setMonth(expiry.getMonth() + 1);

  //   const month = (expiry.getMonth() + 1).toString().padStart(2, "0");
  //   const year = expiry.getFullYear().toString();

  //   return { month, year };
  
  // }

  // ---------------- PDF GENERATION ----------------
  // async generateCardPdf(applicant: any) {
  //   const pdfDoc = await PDFDocument.create();

  //   const page1 = pdfDoc.addPage([243, 153]);
  //   const page2 = pdfDoc.addPage([243, 153]);
   

  //   const frontImageBytes = fs.readFileSync('./dist/Payment/FrontQuess.png');
  //   const backImageBytes = fs.readFileSync('./dist/Payment/BackQuess.png');



  //   const frontImg = await pdfDoc.embedPng(frontImageBytes);
  //   const backImg = await pdfDoc.embedPng(backImageBytes);

  //   page1.drawImage(frontImg, { x: 0, y: 0, width: 243, height: 153 });

  //   const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  //   page1.drawText(applicant.firstname, { x: 20, y: 15, size: 14, font, color: rgb(1, 1, 1) });
  //   page1.drawText(applicant.virtual_card_number, { x: 20, y: 70, size: 14, font, color: rgb(1, 1, 1) });
  //   page1.drawText(applicant.month, { x: 110, y: 50, size: 7, font, color: rgb(1, 1, 1) });
  //   page1.drawText(applicant.year, { x: 130, y: 50, size: 7, font, color: rgb(1, 1, 1) });

  //   page2.drawImage(backImg, { x: 0, y: 0, width: 243, height: 153 });

  //   page2.drawText(applicant.firstname, { x: 35, y: 45, size: 6, font, color: rgb(1, 1, 1) });
  //   page2.drawText(applicant.dob, { x: 134, y: 45, size: 6, font, color: rgb(1, 1, 1) });
  //   page2.drawText(applicant.membership_id, { x: 178, y: 45, size: 6, font, color: rgb(1, 1, 1) });
  //   page2.drawText(applicant.bottomvalue, { x: 178, y: 15, size: 6, font, color: rgb(1, 1, 1) });

  //   const pdfBytes = await pdfDoc.save();
  //   const fileName = `Card-${applicant.applicant_id}.pdf`;
  //   fs.writeFileSync(fileName, pdfBytes);

  //   return fileName;
  // }

  // async sendCardEmail(email: string, fileName: string) {
  //   const transporter = nodemailer.createTransport({
  //    host: "smtpout.secureserver.net",
  // port: 465,
  // secure: true, // use SSL
  // auth: {
  //   user: process.env.GODADDY_CONTACT_EMAIL_USER,
  //   pass: process.env.GODADDY_CONTACT_EMAIL_PASS,
  // },
  //   });

  //   await transporter.sendMail({
  //     from: process.env.GODADDY_CONTACT_EMAIL_USER,
  //     to: email,
  //     subject: "Your AayurCare Membership Card",
  //     text: "Attached is your membership card PDF.",
  //     attachments: [{ filename: fileName, path: `./${fileName}` }],
  //   });
  // }
}

