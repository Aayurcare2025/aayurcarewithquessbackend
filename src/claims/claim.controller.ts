import { Body, Controller, Post, UploadedFile, UseInterceptors } from "@nestjs/common";

import { FileInterceptor } from "@nestjs/platform-express";
import { memoryStorage } from "multer";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { Claims } from "./claim.entity";
import { ClaimsService } from "./claim.service";

if (!process.env.AWS_REGION || !process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
  throw new Error("AWS credentials or region not set in environment variables");
}

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

@Controller("claims")
export class ClaimsController {
  constructor(private readonly claimsService:ClaimsService) {}

  // @Post("apply")
  // @UseInterceptors(FileInterceptor("file", { storage: memoryStorage() }))
  // async applyClaims(
  //   @UploadedFile() file: Express.Multer.File,
  //   @Body() body: any
  // ): Promise<Claims> {
  //   let parsedFormData = {};
  //   try {
  //     parsedFormData = JSON.parse(body.formData);
  //   } catch (e) {
  //       console.log("error",e);
        
  //     // ignore parse error
  //   }

  //   let s3FileUrl: string | null = null;

  //   if (file) {
  //   //   const fileName = `${Date.now()}-${file.originalname}`;
  //   console.log("file",file);
  //     const fileName = file.originalname;
  //     const bucketName = process.env.AWS_BUCKET_NAME;
  //     const region = process.env.AWS_REGION;

  //     await s3.send(
  //       new PutObjectCommand({
  //         Bucket: bucketName,
  //         Key: fileName,
  //         Body: file.buffer,
  //         ContentType: file.mimetype,
  //         ServerSideEncryption: "AES256",
        
  //       //   SSEKMSKeyId: process.env.AWS_KMS_KEY_ID,
  //       })
  //     );

  //     s3FileUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${fileName}`;
  //   }

  //   return this.claimsService.createData({
  //     ...body,
  //     // formData: parsedFormData,
  //     // filePath: s3FileUrl, // S3 URL
  //      file_upload: s3FileUrl,
  //   });
  // }



//   @Post("apply")
// @UseInterceptors(FileInterceptor("file", { storage: memoryStorage() }))
// async applyClaims(
//   @UploadedFile() file: Express.Multer.File,
//   @Body() body: any
// ): Promise<Claims> {
//   console.log("Received body:", body);
//   console.log("Received file:", file?.originalname);

//   let s3FileUrl: string | null = null;

//   if (file) {
//     const fileName = file.originalname;
//     const bucketName = process.env.AWS_BUCKET_NAME;
//     const region = process.env.AWS_REGION;

//     await s3.send(
//       new PutObjectCommand({
//         Bucket: bucketName,
//         Key: fileName,
//         Body: file.buffer,
//         ContentType: file.mimetype,
//         ServerSideEncryption: "AES256",
//       })
//     );

//     s3FileUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${fileName}`;
//   }

//   return this.claimsService.createData({
//     ...body,
//     file_upload: s3FileUrl,
//   });
// }

// }

@Post("apply")
@UseInterceptors(FileInterceptor("file", { storage: memoryStorage() }))
async applyClaims(
  @UploadedFile() file: Express.Multer.File,
  @Body() body: any
): Promise<Claims> {
  console.log("Received body:", body);
  console.log("Received file:", file?.originalname);

  // Upload to S3 if file exists
  let s3FileUrl: string | null = null;
  if (file) {
    const fileName = `${Date.now()}-${file.originalname}`;
    const bucketName = process.env.AWS_BUCKET_NAME!;
    const region = process.env.AWS_REGION!;

    await s3.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
        ServerSideEncryption: "AES256",
      })
    );

    s3FileUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${fileName}`;
  }

  // Ensure you provide all required fields
  const payload = {
    name: body.name || "",
    phonenumber: body.phonenumber || "",
    emailid: body.emailid || null,
    kycdocument: body.kycdocument || null,
    consultationtype: body.consultationtype || null,
    accountHolderName: body.accountHolderName || "",
    bankAccountNumber: body.bankAccountNumber || "",
    reEnterAccountNumber: body.reEnterAccountNumber || "",
    IFSCCode: body.IFSCCode || "",
    BankName: body.BankName || "",
    BankBranchName: body.BankBranchName || "",
    file_upload: s3FileUrl,
  };

  return this.claimsService.createData(payload);
}



}
