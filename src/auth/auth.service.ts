import { BadRequestException, UnauthorizedException, Injectable } from '@nestjs/common';
import { compare, hash } from 'bcrypt';

import { LoginUserDto, RegisterUserDto, LoginFBUserDto } from './dto';
import { User } from './models/user.interface';

@Injectable()
export class AuthService {
    private users: User[] = [];

    // async validateUser(user: LoginUserDto) {
    //     const foundUser = this.users.find( u => u.email === user.email);
    //     if(!user || !foundUser || !(await compare(user.password, foundUser.password))) {
    //         throw new UnauthorizedException('Incorrect username or password');
    //     }
    //     const { password:_, ...retUser } = foundUser;
    //     return retUser;
    // }

    // async registerUser(user: RegisterUserDto): Promise<Omit<User, 'password'>> {
    //     const existingUser = this.users.find(u => u.email === user.email);
    //     if(existingUser) {
    //         throw new BadRequestException('User email must be unique');
    //     }
    //     if(user.password !== user.confirmationPassword) {
    //         throw new BadRequestException('Password and confirmation password must be the same');
    //     }
    //     const { confirmationPassword: _, ...newUser } = user;
    //     this.users.push({
    //         ...newUser,
    //         password: await hash(user.password, 12),
    //         id: this.users.length + 1,
    //         channel: "Local"
    //     });
    //     return {
    //       id: this.users.length,
    //       firstName: user.firstName,
    //       lastName: user.lastName,
    //       email: user.email,
    //       channel: user.channel,
    //     };
    // }

    // findById(id: number): Omit<User, 'password'> {
    //     const { password: _, ...user } = this.users.find(u => u.id === id);
    //     if(!user) {
    //         throw new BadRequestException('No user found');
    //     }
    //     return user;
    // }

    async registerFBUser(FBUser: LoginFBUserDto): Promise<User> {
        const newUser = {
            ...FBUser,
            id: this.users.length,
            channel: "FB",
        };
        this.users.push(newUser);
        return {
            ...newUser,
        };
    }

    async validateOrRegisterFBUser(FBUser: LoginFBUserDto): Promise<User> {
        const findUser = await this.users.find(u => u.OAuthId === FBUser.OAuthId && u.channel==="FB");
        if(findUser) {
            return findUser;
        }
        else {
            return this.registerFBUser(FBUser);
        }
    }
}
