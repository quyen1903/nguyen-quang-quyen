import { Request } from "express";
import { IKeyToken } from "./src/models/keytoken.model";
import { IJWT } from "./src/shared/interface/jwt.interface";

/*
    Extends Request interface
*/
declare module 'express-serve-static-core' {
    interface Request {
        keyStore: IKeyToken;
        user: IJWT;
        refreshToken: string;
    }
}