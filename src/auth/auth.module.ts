import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { FacebookStrategy, LocalStrategy } from './strategy';
import { FBGuard, LocalGuard, LoggedInGuard} from './guards';
import { AuthSerializer } from './serialization.provider';

@Module({
    imports: [
        PassportModule.register({
            session: true,
        }),
    ],
    providers: [AuthService, LocalStrategy, AuthSerializer, FacebookStrategy, FBGuard, LocalGuard, LoggedInGuard],
    controllers: [AuthController],
})
export class AuthModule {}
