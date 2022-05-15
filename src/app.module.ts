import { Inject, Logger, MiddlewareConsumer, NestModule, Module } from '@nestjs/common';
import * as RedisStore from 'connect-redis';
import * as session from 'express-session';
import * as passport from 'passport';
// import { RedisClient } from 'redis';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FacebookStrategy } from './facebook.strategy';
import { REDIS, RedisModule } from './redis';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { FBGuard } from './fb.guard';

@Module({
  imports: [RedisModule, AuthModule],
  controllers: [AppController],
  providers: [AppService, FacebookStrategy, Logger, FBGuard],
})
export class AppModule implements NestModule{
  //TODO: redis client type
  constructor(@Inject(REDIS) private readonly redis: any) {}

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(
      session({
        store: new (RedisStore(session))({
          client: this.redis,
          logErrors: true,
        }),
        saveUninitialized: false,
        secret: 'abcdABCD',
        resave: false,
        cookie: {
          sameSite: true,
          httpOnly: false,
          maxAge: 60*1000,
        },
      }),
      passport.initialize(),
      passport.session(),
    )
    .forRoutes('*');
  }
}
