import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as crypto from 'crypto';
import { Payment } from './payment.entity';
import { Between, Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { createObjectCsvWriter } from 'csv-writer';
import * as fs from 'fs';
import * as nodemailer from 'nodemailer';
@Injectable()
export class PayuService {

  constructor(
    // Inject payment repository here for saving payment records
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
  ) {}
  private key = process.env.PAYU_KEY;
  private salt = process.env.PAYU_SALT;
  private payuUrl = process.env.PAYU_BASE_URL ;

  // ✅ Step 1: Generate hash for transaction (exact PayU format)
 generateHash(data: any): string {
  const hashString =
    `${this.key}|${data.txnid}|${data.amount}|${data.productinfo}` +
    `|||||||||||||${this.salt}`;
    
  console.log("Correct PayU Hash String:", hashString);

  return crypto.createHash('sha512').update(hashString).digest('hex');
}

  // ✅ Step 2: Prepare payment initiation data
  async initiatePayment(paymentData: any) {
    const hash = this.generateHash(paymentData);
    return {
      ...paymentData,
      key: this.key,
      hash,
      payuUrl: this.payuUrl + '/_payment',
    };
  }

  // ✅ Step 3: Verify PayU callback hash
verifyHash(response: any): boolean {
  const hashString = `${this.salt}|${response.status}|||||||||||${response.productinfo}|${response.amount}|${response.txnid}|${this.key}`;

  const hash = crypto.createHash('sha512').update(hashString).digest('hex');
  return hash === response.hash;
}


 async savePayment(data: any) {
    const payment = this.paymentRepo.create({
      firstname: data.firstname,
      email: data.email,
      phone: data.phone,
      amount: data.amount,
      txnid: data.txnid,
      productinfo: data.productinfo,
      status: "Success",
      payment_date: new Date(),
    });

    return this.paymentRepo.save(payment);

}

//get today's payment


async getTodayPayments() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    return this.paymentRepo.find({
      where: {
        payment_date: Between(today, tomorrow),
      },
    });
  }


  // -----------------------------------------------------
  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async sendDailyReport() {
    const payments = await this.getTodayPayments();

    if (payments.length === 0) {
      console.log("No payments today");
      return;
    }

    const filename = `payments-${Date.now()}.csv`;

    await this.generateCSV(filename, payments);

    await this.sendEmail(filename);

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



   async sendEmail(filename: string) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SUPPORT_EMAIL,
        pass: process.env.SUPPORT_EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.SUPPORT_EMAIL,
      to: "contact@aayurcare.com",
      subject: "Daily Payment Report",
      text: "Attached today’s payment report.",
      attachments: [
        { filename, path: `./${filename}` },
      ],
    });
    
  console.log("Daily Report Sent!");
  }
}



