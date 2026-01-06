// // import { Body, Controller, Post, UploadedFile, UseInterceptors } from "@nestjs/common";

// // import { AnyFilesInterceptor } from "@nestjs/platform-express";
// // import { memoryStorage } from "multer";
// // import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
// // import { Claims } from "./claim.entity";
// // import { ClaimsService } from "./claim.service";
// // import { MailService } from "./Mail.service";

// // if (!process.env.AWS_REGION || !process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
// //   throw new Error("AWS credentials or region not set in environment variables");
// // }

// // const s3 = new S3Client({
// //   region: process.env.AWS_REGION,
// //   credentials: {
// //     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
// //     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
// //   },
// // });

// // @Controller("claims")
// // export class ClaimsController {
// //   constructor(private readonly claimsService:ClaimsService,
// //     private readonly mailService: MailService
// //   ) {}




// // @Post("apply")
// // @UseInterceptors(AnyFilesInterceptor())
// // async applyClaims(
// //   @UploadedFile() file: Express.Multer.File,
// //   @Body() body: any
// // ): Promise<Claims> {

// //   console.log("Received file:", file?.originalname);

// //   let s3FileUrl: string | null = null;

// //   if (file) {
// //     // clean filename using person name
// //     const personName = body.name
// //       ?.trim()
// //       .replace(/\s+/g, "-")
// //       .replace(/[^a-zA-Z0-9\-]/g, "");

// //     const ext = file.originalname.split(".").pop();
// //     const fileName = `${personName}.${ext}`;

// //     const bucketName = process.env.AWS_BUCKET_NAME!;
// //     const region = process.env.AWS_REGION!;

// //     await s3.send(
// //       new PutObjectCommand({
// //         Bucket: bucketName,
// //         Key: fileName,
// //         Body: file.buffer,
// //         ContentType: file.mimetype,
// //         ServerSideEncryption: "AES256",
// //       })
// //     );

// //     s3FileUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${fileName}`;

// //     // 🔥 SEND EMAIL WITH ORIGINAL FILE (NOT S3 URL)
// //     await this.mailService.sendFileMail(
// //       "kirthana@aayurcare.com",        // your email here
// //       "New Claim File Uploaded",
// //       `A new claim has been submitted by ${body.name}`,
// //       file                          // ⬅ original uploaded file
// //     );
// //   }

// //   const payload = {
// //     name: body.name || "",
// //     phonenumber: body.phonenumber || "",
// //     emailid: body.emailid || "",
// //     kycdocument: body.kycdocument || "",
// //     consultationtype: body.consultationtype || "",
// //     accountHolderName: body.accountHolderName || "",
// //     bankAccountNumber: body.bankAccountNumber || "",
// //     reEnterAccountNumber: body.reEnterAccountNumber || "",
// //     IFSCCode: body.IFSCCode || "",
// //     BankName: body.BankName || "",
// //     BankBranchName: body.BankBranchName || "",
// //     file_upload: s3FileUrl,
// //   };

// //   return this.claimsService.createData(payload);
// // }



// // }


// import {
//   Body,
//   Controller,
//   Post,
//   UploadedFiles,
//   UseInterceptors,
// } from "@nestjs/common";

// import { AnyFilesInterceptor } from "@nestjs/platform-express";
// import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
// import { Claims } from "./claim.entity";
// import { ClaimsService } from "./claim.service";
// import { MailService } from "./Mail.service";

// // Validate ENV
// if (
//   !process.env.AWS_REGION ||
//   !process.env.AWS_ACCESS_KEY_ID ||
//   !process.env.AWS_SECRET_ACCESS_KEY
// ) {
//   throw new Error("AWS credentials or region not set in environment variables");
// }

// // Create S3 Client
// const s3 = new S3Client({
//   region: process.env.AWS_REGION,
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   },
// });

// @Controller("claims")
// export class ClaimsController {
//   constructor(
//     private readonly claimsService: ClaimsService,
//     private readonly mailService: MailService
//   ) {}

//   @Post("apply")
//   @UseInterceptors(AnyFilesInterceptor())
//   async applyClaims(
//     @UploadedFiles() files: Express.Multer.File[],
//     @Body() body: any
//   ): Promise<Claims> {
//     console.log("📥 Received files:", files.map(f => f.fieldname));

//     const bucketName = process.env.AWS_BUCKET_NAME!;
//     const region = process.env.AWS_REGION!;

//     const personName =
//       body.name?.trim().replace(/\s+/g, "-").replace(/[^a-zA-Z0-9\-]/g, "") ||
//       "user";

//     let bankDocumentUrl: string | null = null;
//     let serviceFileUrls: any[] = [];

//     // 🔹 Extract files based on frontend field names
//     const bankDocument = files.find((f) => f.fieldname === "bankDocument");
//     const serviceDocs = files.filter((f) =>
//       f.fieldname.startsWith("serviceFile_")
//     );

//     // 🔥 Upload bank document
//     if (bankDocument) {
//       const ext = bankDocument.originalname.split(".").pop();
//       const fileName = `${personName}-bank.${ext}`;

//       await s3.send(
//         //data has to be sent to s3 bucket
//         new PutObjectCommand({
//           Bucket: bucketName,
//           Key: fileName,
//           Body: bankDocument.buffer,
//           ContentType: bankDocument.mimetype,
//           ServerSideEncryption: "AES256",
//         })
//       );

//       bankDocumentUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${fileName}`;
//     }

//     // 🔥 Upload service files dynamically
//     for (let i = 0; i < serviceDocs.length; i++) {
//       const file = serviceDocs[i];
//       const ext = file.originalname.split(".").pop();
//       const fileName = `${personName}-service-${i + 1}.${ext}`;

//       await s3.send(
//         new PutObjectCommand({
//           Bucket: bucketName,
//           Key: fileName,
//           Body: file.buffer,
//           ContentType: file.mimetype,
//           ServerSideEncryption: "AES256",
//         })
//       );

//       serviceFileUrls.push({
//         serviceType: body[`serviceType_${i}`], // From frontend
//         fileUrl: `https://${bucketName}.s3.${region}.amazonaws.com/${fileName}`,
//       });
//     }

//     // 🔥 Send ALL files to your mail
//     for (const file of files) {
//       await this.mailService.sendFileMail(
//         "kirthana@aayurcare.com",
//         "New Claim File Uploaded",
//         `Claim submitted by ${body.name}`,
//         file
//       );
//     }

//     // 📌 Prepare DB payload
//     const payload = {
//       name: body.name || "",
//       phonenumber: body.phonenumber || "",
//       emailid: body.emailid || "",
//       servicetype: body.servicetype || "",
//       accountHolderName: body.accountHolderName || "",
//       bankAccountNumber: body.bankAccountNumber || "",
//       reEnterAccountNumber: body.reEnterAccountNumber || "",
//       IFSCCode: body.IFSCCode || "",
//       BankName: body.BankName || "",
//       BankBranchName: body.BankBranchName || "",

//       // FILES
//       bankDocumentUrl,
//       serviceDocuments: JSON.stringify(serviceFileUrls),
//     };

//     // Save to DB
//     return this.claimsService.createData(payload);
//   }
// }

// import {
//   Body,
//   Controller,
//   Post,
//   UploadedFiles,
//   UseInterceptors,
// } from "@nestjs/common";

// import { AnyFilesInterceptor } from "@nestjs/platform-express";
// import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
// import { Claims } from "./claim.entity";
// import { ClaimsService } from "./claim.service";
// import { MailService } from "./Mail.service";

// // Validate ENV
// if (
//   !process.env.AWS_REGION ||
//   !process.env.AWS_ACCESS_KEY_ID ||
//   !process.env.AWS_SECRET_ACCESS_KEY
// ) {
//   throw new Error("AWS credentials or region not set in environment variables");
// }

// // Create S3 Client
// const s3 = new S3Client({
//   region: process.env.AWS_REGION,
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   },
// });

// @Controller("claims")
// export class ClaimsController {
//   constructor(
//     private readonly claimsService: ClaimsService,
//     private readonly mailService: MailService
//   ) {}

//   @Post("apply")
//   @UseInterceptors(AnyFilesInterceptor())
//   async applyClaims(
//     @UploadedFiles() files: Express.Multer.File[],
//     @Body() body: any
//   ): Promise<Claims> {
//     console.log("📥 Received files:", files.map(f => f.fieldname));

//     const bucketName = process.env.AWS_BUCKET_NAME!;
//     const region = process.env.AWS_REGION!;

//     const personName =
//       body.name?.trim().replace(/\s+/g, "-").replace(/[^a-zA-Z0-9\-]/g, "") ||
//       "user";

//     let bankDocumentUrl: string | null = null;
//     let serviceFileUrls: any[] = [];

//     // 🔹 Extract files based on frontend field names
//     const bankDocument = files.find((f) => f.fieldname === "bankDocument");
//     const serviceDocs = files.filter((f) =>
//       f.fieldname.startsWith("serviceFile_")
//     );

//     // 🔥 Upload bank document
//     if (bankDocument) {
//       const ext = bankDocument.originalname.split(".").pop();
//       const fileName = `${personName}-bank.${ext}`;

//       await s3.send(
//         new PutObjectCommand({
//           Bucket: bucketName,
//           Key: fileName,
//           Body: bankDocument.buffer,
//           ContentType: bankDocument.mimetype,
//           ServerSideEncryption: "AES256",
//         })
//       );

//       bankDocumentUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${fileName}`;
//     }

//     // 🔥 Upload service files dynamically
//     for (let i = 0; i < serviceDocs.length; i++) {
//       const file = serviceDocs[i];
//       const ext = file.originalname.split(".").pop();
//       const fileName = `${personName}-service-${i + 1}.${ext}`;

//       await s3.send(
//         new PutObjectCommand({
//           Bucket: bucketName,
//           Key: fileName,
//           Body: file.buffer,
//           ContentType: file.mimetype,
//           ServerSideEncryption: "AES256",
//         })
//       );

//       serviceFileUrls.push({
//         serviceType: body[`serviceType_${i}`],
//         fileUrl: `https://${bucketName}.s3.${region}.amazonaws.com/${fileName}`,
//       });
//     }

//     // 🔥 Send ONE email with ALL files as attachments
//     const emailBody = `
// New Claim Submission

// Claimant Details:
// - Name: ${body.name}
// - Phone: ${body.phonenumber}
// - Email: ${body.emailid}

// Bank Details:
// - Account Holder: ${body.accountHolderName}
// - Account Number: ${body.bankAccountNumber}
// - IFSC Code: ${body.IFSCCode}
// - Bank Name: ${body.BankName}
// - Branch: ${body.BankBranchName}

// Services:
// ${serviceDocs.map((_, i) => `- Service ${i + 1}: ${body[`serviceType_${i}`] || 'N/A'}`).join('\n')}

// All documents are attached to this email.
//     `.trim();

//     await this.mailService.sendMultipleFilesMail(
//       "GODADDY_CLAIMS_EMAIL",
//       "New Claim Submission",
//       emailBody,
//       files // Send ALL files at once
//     );

//     // 📌 Prepare DB payload
//     const payload = {
//       name: body.name || "",
//       phonenumber: body.phonenumber || "",
//       emailid: body.emailid || "",
//       servicetype: body.servicetype || "",
//       accountHolderName: body.accountHolderName || "",
//       bankAccountNumber: body.bankAccountNumber || "",
//       reEnterAccountNumber: body.reEnterAccountNumber || "",
//       IFSCCode: body.IFSCCode || "",
//       BankName: body.BankName || "",
//       BankBranchName: body.BankBranchName || "",

//       // FILES
//       bankDocumentUrl,
//       serviceDocuments: JSON.stringify(serviceFileUrls),
//     };

//     // Save to DB
//     return this.claimsService.createData(payload);
//   }
// }



import {
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from "@nestjs/common";

import { AnyFilesInterceptor } from "@nestjs/platform-express";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { Claims } from "./claim.entity";
import { ClaimsService } from "./claim.service";
import { MailService } from "./Mail.service";

// Validate ENV
if (
  !process.env.AWS_REGION ||
  !process.env.AWS_ACCESS_KEY_ID ||
  !process.env.AWS_SECRET_ACCESS_KEY
) {
  throw new Error("AWS credentials or region not set in environment variables");
}

// Create S3 Client
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

@Controller("claims")
export class ClaimsController {
  constructor(
    private readonly claimsService: ClaimsService,
    private readonly mailService: MailService
  ) {}

  @Post("apply")
  @UseInterceptors(AnyFilesInterceptor())
  async applyClaims(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: any
  ): Promise<Claims> {
    console.log("📥 Received files:", files.map(f => f.fieldname));

    const bucketName = process.env.AWS_BUCKET_NAME!;
    const region = process.env.AWS_REGION!;

    const personName =
      body.name?.trim().replace(/\s+/g, "-").replace(/[^a-zA-Z0-9\-]/g, "") ||
      "user";

    let bankDocumentUrl: string | null = null;
    let serviceFileUrls: any[] = [];

    // 🔹 Extract files based on frontend field names
    const bankDocument = files.find((f) => f.fieldname === "bankDocument");
    const serviceDocs = files.filter((f) =>
      f.fieldname.startsWith("serviceFile_")
    );

    // 🔥 Upload bank document
    if (bankDocument) {
      const ext = bankDocument.originalname.split(".").pop();
      const fileName = `${personName}-bank.${ext}`;

      await s3.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: fileName,
          Body: bankDocument.buffer,
          ContentType: bankDocument.mimetype,
          ServerSideEncryption: "AES256",
        })
      );

      bankDocumentUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${fileName}`;
    }

    // 🔥 Upload service files dynamically
    for (let i = 0; i < serviceDocs.length; i++) {
      const file = serviceDocs[i];
      const ext = file.originalname.split(".").pop();
      const fileName = `${personName}-service-${i + 1}.${ext}`;

      await s3.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: fileName,
          Body: file.buffer,
          ContentType: file.mimetype,
          ServerSideEncryption: "AES256",
        })
      );

      serviceFileUrls.push({
        serviceType: body[`serviceType_${i}`],
        fileUrl: `https://${bucketName}.s3.${region}.amazonaws.com/${fileName}`,
      });
    }

    // 🔥 Send ONE email with ALL files as attachments
    const emailBody = `
New Claim Submission

Claimant Details:
- Name: ${body.name}
- Phone: ${body.phonenumber}
- Email: ${body.emailid}

Bank Details:
- Account Holder: ${body.accountHolderName}
- Account Number: ${body.bankAccountNumber}
- IFSC Code: ${body.IFSCCode}
- Bank Name: ${body.BankName}
- Branch: ${body.BankBranchName}

Services:
${serviceDocs.map((_, i) => `- Service ${i + 1}: ${body[`serviceType_${i}`] || 'N/A'}`).join('\n')}

All documents are attached to this email.
    `.trim();

    await this.mailService.sendMultipleFilesMail(
      "Claims@aayurcare.com",
      "New Claim Submission",
      emailBody,
      files // Send ALL files at once
    );

    // 📌 Prepare DB payload
    const payload = {
      name: body.name || "",
      phonenumber: body.phonenumber || "",
      emailid: body.emailid || "",
      servicetype: body.servicetype || "",
      accountHolderName: body.accountHolderName || "",
      bankAccountNumber: body.bankAccountNumber || "",
      reEnterAccountNumber: body.reEnterAccountNumber || "",
      IFSCCode: body.IFSCCode || "",
      BankName: body.BankName || "",
      BankBranchName: body.BankBranchName || "",

      // FILES
      bankDocumentUrl,
      serviceDocuments: JSON.stringify(serviceFileUrls),
    };

    // Save to DB
    return this.claimsService.createData(payload);
  }
}