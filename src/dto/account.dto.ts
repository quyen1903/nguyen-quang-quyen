import { IsString, IsNotEmpty,IsOptional, IsIn } from 'class-validator';
import { UsernameValidator } from "../shared/validators/username.validator";
import { PasswordValidator } from "../shared/validators/password.validator";
import { IAccountBase, IAccountRegister, IAccountUpdate } from '../shared/interface/account.interface';

export class LoginDTO implements IAccountBase{
    @IsString()
    @IsNotEmpty()
    @UsernameValidator()
    username: string;

    @IsString()
    @IsNotEmpty()
    @PasswordValidator()
    password: string;

    constructor({username, password}:{username: string, password: string}){
        this.username = username;
        this.password = password;
    }
}

export class RegisterDTO extends LoginDTO implements IAccountRegister{
    @IsString()
    @IsNotEmpty()
    fullname: string;

    @IsString()
    @IsNotEmpty()
    avatar: string;

    constructor ({ username, password, fullname, avatar }: { username: string, password: string, fullname: string, avatar: string }) {
        super({ username, password });
        this.fullname = fullname;
        this.avatar = avatar
    }
}

export class UpdateDTO implements IAccountUpdate {

    @IsOptional()
    @IsString()
    username?: string;

    @IsOptional()
    @IsString()
    fullname?: string;

    @IsOptional()
    @IsString()
    avatar?: string;

    @IsOptional()
    @IsIn(['active', 'inactive'])
    status?: 'active' | 'inactive';

    constructor({ username, fullname, avatar, status }: { 
        username?: string,
        fullname?: string, 
        avatar?: string, 
        status?: 'active' | 'inactive' 
    }) {
        this.username = username;
        this.fullname = fullname;
        this.avatar = avatar;
        this.status = status;
    }
}

export class ChangePasswordDTO {
    @IsString()
    @IsNotEmpty()
    @PasswordValidator()
    password: string;

    @IsString()
    @IsNotEmpty()
    @PasswordValidator()
    newPassword: string;

    
    constructor ({ password, newPassword }: { password: string, newPassword: string }) {
        this.password = password
        this.newPassword = newPassword;
    }
}