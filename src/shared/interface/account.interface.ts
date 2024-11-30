export interface IAccountBase {
    username: string;
    password: string;
}

export interface IAccountRegister extends IAccountBase {
    fullname: string;
    avatar: string;
}

export interface IAccountUpdate{
    username?: string
    fullname?: string,
    avatar?: string,
    status?: 'active' | 'inactive';
}