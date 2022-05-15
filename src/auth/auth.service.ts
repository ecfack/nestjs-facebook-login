import { BadRequestException, UnauthorizedException, Injectable } from '@nestjs/common';
import { compare, hash } from 'bcrypt';

import { LoginUserDto, RegisterUserDto, LoginFBUserDto } from './dto';
import { User } from './models/user.interface';

@Injectable()
export class AuthService {
    private users: User[] = [];

    async validateUser(user: LoginUserDto) {
        const foundUser = this.users.find( u => u.email === user.email && u.channel==="Local");
        if(!user || !foundUser || !(await compare(user.password, foundUser.password))) {
            throw new UnauthorizedException('Incorrect username or password');
        }
        const { password:_, ...retUser } = foundUser;
        return retUser;
    }

    async registerUser(user: RegisterUserDto): Promise<Omit<User, 'password'>> {
        const existingUser = this.users.find(u => u.email === user.email && u.channel==="Local");
        if(existingUser) {
            throw new BadRequestException('User email must be unique');
        }
        if(user.password !== user.confirmationPassword) {
            throw new BadRequestException('Password and confirmation password must be the same');
        }
        const { confirmationPassword: _, ...newUserData } = user;
        const newUser:User = {
            ...newUserData,
            password: await hash(user.password, 12),
            id: this.users.length + 1,
            channel: "Local",
            OAuthId: ""
        };
        this.users.push(newUser);
        return newUser;
    }

    async findById(id: number): Promise<User> {
        const user  = this.users.find(u => u.id === id);
        if(!user) {
            console.log(this.users,id)
            throw new BadRequestException('No user found');
        }
        return user;
    }

    async findUserByFBId(FBId:string): Promise<User> {
        const findUser = this.users.find(u => u.OAuthId === FBId && u.channel==="FB");
        return findUser;
    }

    async registerFBUser(FBUser: LoginFBUserDto): Promise<User> {
        const newUser = {
            ...FBUser,
            id: this.users.length+1,
            channel: "FB",
            password: ""
        };
        this.users.push(newUser);
        return {
            ...newUser,
        };
    }

    async validateOrRegisterFBUser(FBUser: LoginFBUserDto): Promise<User> {
        const findUser = await this.findUserByFBId(FBUser.OAuthId);
        if(findUser) {
            return findUser;
        }
        else {
            return this.registerFBUser(FBUser);
        }
    }
}
