import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { User } from './models/user.interface';

@Injectable()
export class AuthSerializer extends PassportSerializer {
    constructor(private readonly authService: AuthService) {
        super();
    }
    serializeUser(user: User, done: (err: Error, user: {id: number}) => void) {
        console.log('serialize called');
        done(null, { id: user.id});
    }

    async deserializeUser(payload: {id: number}, done: (err: Error, user: User) => void) {
        const user = await this.authService.findById(payload.id);
        console.log('deserialize called');
        done(null, user);
    }
}