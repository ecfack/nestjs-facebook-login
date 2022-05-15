import { Body, Post, Req, UseGuards,Controller } from '@nestjs/common';

import { LocalGuard } from '../local.guard';
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
        console.log(req.user)
        return req.session;
    }
}
