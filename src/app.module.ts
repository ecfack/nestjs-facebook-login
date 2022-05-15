import { Inject, Logger, MiddlewareConsumer, NestModule, Module } from '@nestjs/common';
import * as RedisStore from 'connect-redis';
import * as session from 'express-session';
import * as passport from 'passport';
// import { RedisClient } from 'redis';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { REDIS, RedisModule } from './redis';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [RedisModule, AuthModule],
  controllers: [AppController],
  providers: [AppService, Logger],
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
          maxAge: 5*60*1000,
        },
      }),
      passport.initialize(),
      passport.session(),
    )
    .forRoutes('*');
  }
}
