    import { Body, Controller, Get, HttpCode, Request, HttpStatus, Post, UseGuards, Req, Res } from '@nestjs/common';
    import { AuthService } from './auth.service';
import { AuthGuard } from './guards/auth.guards';
// import { AuthGuard } from '@nestjs/passport';
    // import { AuthGuard } from '@nestjs/passport';
     

    @Controller('auth')
    export class AuthController {
        constructor(private authService: AuthService) { }

        //   @HttpCode(HttpStatus.OK)
        @Post('login')
        //   async signIn(@Body() signInDto: Record<string, any>) {
        async signIn(@Req() req: any) {
            const { username, password } = req.body;
            console.log("Login")
            return await this.authService.signIn(username, password);
        }


        // @UseGuards(AuthGuard,RolesGuard)
        // @Roles(UserRole.ADMIN)
        @UseGuards(AuthGuard)
        @Get('profile')
        getProfile(@Request() req: any) {
            return req.user;
        }

    }
