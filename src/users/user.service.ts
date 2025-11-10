// import { BadRequestException, Injectable } from '@nestjs/common';
// import { UserDto } from './user.dto';
// import * as bcrypt from 'bcrypt';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import crypto from 'crypto';
// import { User } from './user.entity';
// import { UserRole } from 'src/enum/ole.enum';
// import * as nodemailer from 'nodemailer';
// import { ConfigService } from '@nestjs/config';


// @Injectable()
// export class UsersService {
//     constructor(
//         @InjectRepository(User)
//         private readonly userRepository: Repository<User>,

//         private readonly configService: ConfigService,
  
      
      
//       ) {}
//       async findOne(username: string): Promise<User | undefined> {
//   const user = await this.userRepository.findOne({ where: { username: username } });
//   return user ?? undefined;  // converts null → undefined
// }

// // async userregister(userregister: Userdto): Promise<User> {
// //   // Check if username already exists
// //   const existingUser = await this.userRepository.findOne({
// //     where: { username: userregister.username },
// //   });
// //   if (existingUser) {
// //     throw new Error('Username already exists. Please choose a different one.');
// //   }
// //   try {
// //     const salt = await bcrypt.genSalt();
// //     const hashedpassword = await bcrypt.hash(userregister.password, salt);

// //     const user = new User();
// //     user.username = userregister.username;
// //     user.password = hashedpassword;
// //     user.role = userregister.role || UserRole.USER

// //     await user.save(); 
    

// //     const { password, ...rest } = user;
// //     return rest as User;
// //   } catch (error) {
// //     if (
     
// //       error.code === 'ER_DUP_ENTRY' || 
// //       (error.message && error.message.includes('Duplicate entry'))
// //     ) {
// //       throw new Error('Username already exists. Please choose a different one.');
// //     }
// //     throw error;
// //   }
// // }

// async userregister(userRegister: UserDto): Promise<Partial<User>> {
//   // Check if username exists
//   const existingUser = await this.userRepository.findOne({
//     where: { username: userRegister.username },
//   });
//   if (existingUser) {
//     throw new Error("Username already exists. Please choose a different one.");
//   }

//   // Check password == confirmPassword
//   if (userRegister.password !== userRegister.confirmPassword) {
//     throw new Error("Passwords do not match.");
//   }

//   // Hash password
//   const salt = await bcrypt.genSalt();
//   const hashedPassword = await bcrypt.hash(userRegister.password, salt);

//   // Create user
//   const user = new User();
//   user.fullName = userRegister.fullName;
//   user.email = userRegister.email;
//   user.username = userRegister.username;
//   user.password = hashedPassword;

//   user.role = userRegister.role || UserRole.USER;

//   await user.save();

//   // Return user without password
//   // const { password, confirmPassword, ...rest } = user;
//   const { password, ...rest } = user;
//   return rest;
// }


//   // async applyInsurance(insuranceDto: InsuranceDto): Promise<Insurance> {
//   //   try {
//   //     const newInsurance = this.insuranceRepository.create(insuranceDto);
//   //     return await this.insuranceRepository.save(newInsurance);
//   //   } catch (err) {
//   //     console.log("error",err);
//   //     throw new BadRequestException('Failed to apply for insurance');
//   //   }
//   // }
//   // user.service.ts


//  async sendPasswordResetEmail(emailOrUsername: string, frontendResetUrlBase: string) {
//     // find user by email or username
//     const user = await this.userRepository.findOne({
//       where: [{ email: emailOrUsername }, { username: emailOrUsername }],
//     });
//     if (!user) {
//       // Don't reveal that user doesn't exist — resolve normally to avoid user enumeration
//       return { ok: true };
//     }

//     // Generate a token (random)
//     const token = crypto.randomBytes(32).toString('hex');

//     // Set expiry (e.g., 1 hour from now)
//     const expires = Date.now() + 60 * 60 * 1000;

//     // Optionally hash the token before saving (recommended). For brevity we store token directly.
//     user.resetPasswordToken = token;
//     user.resetPasswordExpires = expires;
//     await this.userRepository.save(user);

//     // Create reset link for frontend: e.g. https://your-frontend/reset-password?token=...&id=123
//     const resetLink = `${frontendResetUrlBase}?token=${token}&id=${user.id}`;

//     // Send email
//     await this._sendResetEmail(user.email, user.fullName || user.username, resetLink);

//     return { ok: true };
//   }




//    async resetPassword(userId: number, token: string, newPassword: string) {
//     const user = await this.userRepository.findOne({ where: { id: userId } });
//     if (!user) throw new BadRequestException('Invalid or expired token.');

//     if (!user.resetPasswordToken || !user.resetPasswordExpires) {
//       throw new BadRequestException('Invalid or expired token.');
//     }

//     if (user.resetPasswordToken !== token) {
//       throw new BadRequestException('Invalid or expired token.');
//     }

//     if (Date.now() > Number(user.resetPasswordExpires)) {
//       throw new BadRequestException('Token expired.');
//     }

//     // Hash new password and save
//     const salt = await bcrypt.genSalt();
//     user.password = await bcrypt.hash(newPassword, salt);

//     // Clear reset fields
//     user.resetPasswordToken = null;
//     user.resetPasswordExpires = null;

//     await this.userRepository.save(user);

//     return { ok: true, message: 'Password updated successfully' };
//   }

//   // helper to send email using nodemailer (config below)
//   private async _sendResetEmail(to: string, name: string, resetLink: string) {
//     // Configure transporter (Gmail example uses app password or OAuth2)
//     const transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: process.env.EMAIL_USER, // e.g. your-email@gmail.com
//         pass: process.env.EMAIL_PASS, // app password (recommended) or OAuth2 token
//       },
//     });

//     const mailOptions = {
//       from: `"Aayurcare" <${process.env.EMAIL_USER}>`,
//       to,
//       subject: 'Password reset request',
//       html: `
//         <p>Hi ${name},</p>
//         <p>You requested a password reset. Click the link below to set a new password. This link expires in 1 hour.</p>
//         <p><a href="${resetLink}">Reset your password</a></p>
//         <p>If you didn't ask for this, ignore this email.</p>
//       `,
//     };

//     await transporter.sendMail(mailOptions);
//   }


//    async sendCallbackEmail(formData: {
//     name: string;
//     email: string;
//     phone: string;
//     problemdescription: string;
//   }) {
//     const { name, email, phone, problemdescription } = formData;

//     try {
//       const provider = this.configService.get('EMAIL_PROVIDER') || 'GMAIL';
//       const prefix = provider === 'GODADDY' ? 'GODADDY' : 'GMAIL';

//       // const transporter = nodemailer.createTransport({
//       //   host: this.configService.get(`${prefix}_GODADDY_EMAIL_HOST`),
//       //  port: parseInt(this.configService.get(`${prefix}_GODADDY_EMAIL_PORT`) || '465'),

//       //   secure: true,// true for 465
//       //   auth: {
//       //     user: this.configService.get(`${prefix}_EMAIL_USER`),
//       //     pass: this.configService.get(`${prefix}_EMAIL_PASS`),
//       //   },
//       // });


//       const transporter = nodemailer.createTransport({
//   host: process.env.GODADDY_EMAIL_HOST,
//   port: Number(process.env.GODADDY_EMAIL_PORT) ,
//   secure: true, // true for 465
//   auth: {
//     user: process.env.GODADDY_EMAIL_USER,
//     pass: process.env.GODADDY_EMAIL_PASS,
//   },
// });

//       // 1️⃣ Send mail to company
    


//     await transporter.sendMail({
//   from: this.configService.get('GODADDY_EMAIL_USER'), // your GoDaddy email
//   to: this.configService.get('GODADDY_EMAIL_TO'),     // your Aayurcare inbox
//   subject: `📞 Callback Request from ${name}`,
//   html: `
//     <h3>New Callback Request</h3>
//     <p><b>Name:</b> ${name}</p>
//     <p><b>Email:</b> ${email}</p> <!-- user's email in body -->
//     <p><b>Phone:</b> ${phone}</p>
//     <p><b>Problem:</b> ${problemdescription}</p>
//   `,
// });
// await transporter.verify();
// console.log("SMTP server ready to take messages");




// }
//     catch (err) {
//       console.error('Error sending callback email:', err);
//       throw new BadRequestException(
//         'Failed to send callback request email.',
//       );
//     }
//   }






// }




import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as nodemailer from 'nodemailer';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async sendLoginOtp(email: string) {
    let user = await this.userRepo.findOne({ where: { email } });
    // if (!user) throw new BadRequestException('Email not found');
  if (!user) {
    user = this.userRepo.create({ email });
    await this.userRepo.save(user);
    
    console.log("New user created:", user);
  }

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    const expires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes validity

    user.otpCode = otp;
    user.otpExpiresAt = expires;
    await this.userRepo.save(user);

    // Send OTP email
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
      from: process.env.GODADDY_EMAIL_USER,
      to: user.email,
      subject: 'Your OTP for Aayurcare Login',
      html: `<p>Your login OTP is <b>${otp}</b>. It is valid for 5 minutes.</p>`,
    });

    return { message: 'OTP sent successfully to your email.' };
  }

  async verifyOtpAndLogin(email: string, otp: string) {
    let user = await this.userRepo.findOne({ where: { email } });
    // if (!user) throw new UnauthorizedException('Invalid email or OTP');
 if (!user) {
    user = this.userRepo.create({ email });
    await this.userRepo.save(user);
  }

    if (user.otpCode !== otp || !user.otpExpiresAt || user.otpExpiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    // Clear OTP after successful login
    user.otpCode = null;
    user.otpExpiresAt = null;
    await this.userRepo.save(user);

    // Generate JWT
    const payload = { email: user.email, id: user.id };
    const token = this.jwtService.sign(payload);

    return {
      message: 'Login successful',
      access_token: token,
      user: { id: user.id, email: user.email },
    };
  }
}










