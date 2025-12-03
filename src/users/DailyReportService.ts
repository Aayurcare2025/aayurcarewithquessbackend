import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Login } from './login.entity';
import * as ExcelJS from 'exceljs';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { Applicant } from 'src/Api/dash.entity';

@Injectable()
export class DailyReportService {

  constructor(

    @InjectRepository(Login)
    private readonly loginRepo: Repository<Login>,
    private config: ConfigService,
    

    @InjectRepository(Applicant)
    private readonly applicantRepo:Repository<Applicant>,
  ) {}


  //we need to fetch name from api ,then only we can get name ::

@Cron('59 59 23 * * *', { timeZone: 'Asia/Kolkata' }) 
async generateDailyReport() {

  
  // 1️⃣ Get start and end of today in IST
  const now = new Date();
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0); // 00:00:00
  const todayEnd = new Date(now);
  todayEnd.setHours(23, 59, 59, 999); // 23:59:59

  // 2️⃣ Fetch today's logins
  const logins = await this.loginRepo
    .createQueryBuilder("login")
    .where("login.login_date BETWEEN :start AND :end", {
      start: todayStart,
      end: todayEnd,
    })
    .getMany();

  if (logins.length === 0) {
    console.log("No logins today. Skipping email report.");
    return;
  }

  // 3️⃣ Create Excel workbook
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Daily Login Report');

  //we need to call api so we can get person names so we can track ::::::
  // worksheet.columns = [
  //   { header: 'Phone Number', key: 'contact_number', width: 20 },
  //   { header: 'Login Date and Time', key: 'login_date', width: 25 },
  // ];


   worksheet.columns = [
    { header: 'contact_number', key: 'contact_number', width: 20 },
    {header:'first_name',key:'first_name',width:20},
    { header: 'Login Date and Time', key: 'login_date', width: 25 },
  ];

  // logins.forEach((login) => {
   for(const login of logins){


    // worksheet.addRow({
    //   phonenumber: login.phonenumber,
      
    //   login_date: login.login_date.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    // });


    //call api to get data::

    // Fetch name from Applicant table using applicant_id stored in Login entry
const applicant =  await this.applicantRepo.findOne({
  where: { applicant_id: login.applicant_id },
});

worksheet.addRow({

  first_name: applicant?.first_name || 'N/A',
  contact_number: login.contact_number,
  login_date: login.login_date.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
});


  }



  // 4️ Generate Excel in memory
  const excelBuffer = Buffer.from(await workbook.xlsx.writeBuffer());

  // 5️⃣ Send email
  const transporter = nodemailer.createTransport({
    host: process.env.GODADDY_EMAIL_HOST,
    port: Number(process.env.GODADDY_EMAIL_PORT),
    secure: true,
    auth: {
      user: process.env.GODADDY_EMAIL_USER,
      pass: process.env.GODADDY_EMAIL_PASS,
    },
  });

  
  await transporter.sendMail({
    from: this.config.get('GODADDY_EMAIL_USER'),
    to: this.config.get('GODADDY_PNO_EMAIL_USER_TO'),
    subject: ` Daily Login Report - ${now.toLocaleDateString('en-IN')}`,
    text: 'Attached is the daily login report.',
    attachments: [
      {
        filename: `login_report_${now.toISOString().split('T')[0]}.xlsx`,
        content: excelBuffer,
      },
    ],
  });

  console.log(" Daily login report emailed successfully (no file saved).");
}

}
