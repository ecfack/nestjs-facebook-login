import { Controller, Get, UseGuards, HttpStatus, Req, Session } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

import { AppService } from './app.service';

import { AdminGuard } from './admin.guard';
import { LoggedInGuard } from './logged-in.guard';
import { FBGuard } from './fb.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/facebook')
  @UseGuards(FBGuard)
  async facebookLogin(): Promise<any> {
    return HttpStatus.OK;
  }

  @Get('/facebook/redirect')
  @UseGuards(FBGuard)
  async facebookLoginRedirect(@Req() req: Request): Promise<any> {
    console.log(req.session,req.sessionID)
    return {
      statusCode: HttpStatus.OK,
      payload: req.user
    };
  }

  @Get()
  publicRoute(@Req() req: Request) {
    console.log(req.session)
    return this.appService.getPublicMessage();
  }

  @UseGuards(LoggedInGuard)
  @Get('protected')
  guardedRoute() {
    return this.appService.getPrivateMessage();
  }

  @UseGuards(AdminGuard)
  @Get('admin')
  getAdminMessage() {
    return this.appService.getAdminMessage();
  }
}
