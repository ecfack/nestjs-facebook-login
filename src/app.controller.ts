import { Controller, Get, UseGuards, HttpStatus, Req, Session } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  publicRoute(@Req() req: Request) {
    return this.appService.getPublicMessage();
  }
}
