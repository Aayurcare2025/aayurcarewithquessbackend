import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';


@Controller('otp')
export class UsersController {
  constructor(private readonly otpService: UserService) {}

  // -------------------------------------------------------
  // SEND OTP
  // -------------------------------------------------------
  @Post('send')
  async sendOtp(@Body('phone') phone: string) {
    console.log("phone" , phone); 
    return await this.otpService.sendOtp(phone);
  }

  // -------------------------------------------------------
  // VERIFY OTP
  // -------------------------------------------------------
  @Post('verify')
  async verifyOtp(
    @Body('phone') phone: string,
    @Body('otp') otp: string,
  ) {
    return await this.otpService.verifyOtp(phone, otp);
  }

  // -------------------------------------------------------
  // SEND CALLBACK EMAIL
  // -------------------------------------------------------
  @Post('callback')
  async callbackRequest(
    @Body()
    body: {
      name: string;
      email: string;
      phone: string;
      problemdescription: string;
    },
  ) {
    return await this.otpService.sendCallbackEmail(body);
  }
}
