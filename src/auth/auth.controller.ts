import { Body, Get, Post, Req, HttpStatus, UseGuards,Controller, Redirect } from '@nestjs/common';
import { Request } from 'express';

import { LocalGuard, FBGuard, LoggedInGuard } from './guards';
import { AuthService } from './auth.service';
import { LoginUserDto, RegisterUserDto } from './dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    registerUser(@Body() user: RegisterUserDto) {
        return this.authService.registerUser(user);
    }

    @UseGuards(LocalGuard)
    @Post('login')
    loginUser(@Req() req, @Body() user: LoginUserDto) {
        return {
            statusCode: HttpStatus.OK,
            payload: {
                user: req.user,
                sessionID: req.sessionID,
                session: req.session
            }
        };
    }

    @Get('/facebook')
    @UseGuards(FBGuard)
    async facebookLogin(): Promise<any> {
        return HttpStatus.OK;
    }

    @Redirect('/auth/protected', 302)
    @Get('/facebook/redirect')
    @UseGuards(FBGuard)
    async facebookLoginRedirect(@Req() req: Request): Promise<any> {
        return ;
    }

    @Get('logout')
    @UseGuards(LoggedInGuard)
    logout(@Req() req: Request) {
        req.logOut();
        req.session.destroy( (err) =>{

        });
        return {
            statusCode: HttpStatus.OK,
            payload: {
                message: 'Logout success!'
            }
        };
    }

    @Get('protected')
    @UseGuards(LoggedInGuard)
    guardedRoute(@Req() req: Request) {
        return {
            statusCode: HttpStatus.OK,
            payload: {
                user: req.user
            }
        };
    }
}
