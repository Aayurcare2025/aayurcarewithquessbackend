

import { User } from "./user.entity";

import * as bcrypt from 'bcrypt';
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "./user.service";
import {
  BadRequestException, Body, Controller, Post, UnauthorizedException, ValidationPipe
 
} from "@nestjs/common";
import { UserDto } from "./user.dto";



@Controller('user')
export class UserController {
  constructor(private userService: UsersService,
    private readonly jwtService: JwtService,
  ) { }

  // @UseGuards(AuthGuard,RolesGuard)
  // @Roles(UserRole.ADMIN)


  @Post('/register')
  async UserRegister(
    @Body(ValidationPipe) userRegister: UserDto
  ): Promise<any> {
    try {
      return await this.userService.userregister(userRegister);
    } catch (error) {
      throw new BadRequestException(error.message || 'Registration failed');
    }
  }


  @Post('/login')
  async login(@Body() userLogin: UserDto): Promise<any>
  {
    const user = await this.userService.findOne(userLogin.username);
    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }
    const isPasswordValid = await bcrypt.compare(userLogin.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid username or password');
    }

    // You can return user data (without password) or JWT token here
    // const { password, ...rest } = user;
    // return rest;
    const payload = {
      username: user.username,
      ref_id: user.id,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      access_token: accessToken,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    }

  }


    @Post('forgot')
  async forgotPassword(
    @Body() body: { emailOrUsername: string; frontendResetUrl: string }
  ) {
    // frontendResetUrl example: https://myfrontend.com/reset-password
    // We intentionally don't reveal whether email exists
    await this.userService.sendPasswordResetEmail(body.emailOrUsername, body.frontendResetUrl);
    return { message: 'If an account exists, a password reset email has been sent.' };
  }


  @Post('reset')
  async resetPassword(
    @Body() body: { id: number; token: string; newPassword: string; confirmPassword: string }
  ) {
    if (body.newPassword !== body.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }
    await this.userService.resetPassword(body.id, body.token, body.newPassword);
    return { message: 'Password reset successfully' };
  }


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
  await this.userService.sendCallbackEmail(body);
  return { message: 'Callback request sent successfully.' };
}

  
}









  




