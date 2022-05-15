import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-facebook';

import { AuthService } from '../auth.service'

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  
  constructor(private readonly authService: AuthService) {
    super({
      clientID: process.env.APP_ID,
      clientSecret: process.env.APP_SECRET,
      callbackURL: 'http://localhost:3000/auth/facebook/redirect',
      scope: 'email',
      profileFields: ['emails', 'name'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (err: any, user: any, info?: any) => void,
  ): Promise<any> {
    const { id, name, emails } = profile;
    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      OAuthId: id,
    };

    const userData = await this.authService.validateOrRegisterFBUser(user);
    
    const payload = {
      ...userData
    };

    done(null, payload);
  }
}
