export class RegisterUserDto {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmationPassword: string;
    channel:string = 'Local';
}