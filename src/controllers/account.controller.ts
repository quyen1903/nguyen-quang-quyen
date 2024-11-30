import { Request, Response, NextFunction } from 'express'; 
import AccessService from "../services/account.service";
import { SuccessResponse } from '../core/success.response';
import { RegisterDTO, LoginDTO, UpdateDTO, ChangePasswordDTO } from '../dto/account.dto';
import {validator} from '../shared/utils'

class AccessController{

    deleteAccount = async(req: Request, res: Response, next: NextFunction)=>{
        new SuccessResponse({
            message:'delete account success',
            metadata:await AccessService.deleteAccount(req.keyStore)
        }).send(res)
    };

    readAccount = async(req: Request, res: Response, next: NextFunction)=>{
        new SuccessResponse({
            message:'read account success',
            metadata:await AccessService.readAccount(req.keyStore)
        }).send(res)
    };

    searchAccount = async(req: Request, res: Response, next: NextFunction)=>{
        new SuccessResponse({
            message:'search account success',
            metadata:await AccessService.searchAccount(req.body.keySearch)
        }).send(res)
    };

    updateAccount = async(req: Request, res: Response, next: NextFunction)=>{
        const payload =  new UpdateDTO(req.body)
        await validator(payload)
        new SuccessResponse({
            message:'update user success',
            metadata:await AccessService.updateAccount(req.keyStore, payload)
        }).send(res)
    }

    changePassword = async(req: Request, res: Response, next: NextFunction)=>{
        const payload =  new ChangePasswordDTO(req.body)
        await validator(payload)
        new SuccessResponse({
            message:'change password success',
            metadata:await AccessService.changePassword(req.keyStore,payload)
        }).send(res)
    }

    handlerRefreshToken = async(req: Request, res: Response, next: NextFunction)=>{
        new SuccessResponse({
            message:'get token success',
            metadata:await AccessService.handleRefreshToken(
                req.keyStore,
                req.user,
                req.refreshToken,
            )
        }).send(res)
    }

    logout = async(req: Request, res: Response, next: NextFunction)=>{
        new SuccessResponse({
            message:'logout success',
            metadata:await AccessService.logout( req.keyStore )
        }).send(res)
    }

    login = async(req: Request, res: Response, next: NextFunction)=>{
        const payload = new LoginDTO(req.body);
        await validator(payload)
        new SuccessResponse({
            message: 'login success',
            metadata:await AccessService.login(payload)
        }).send(res)
    }
    register = async (req: Request, res: Response, next: NextFunction) => {
        const payload = new RegisterDTO(req.body);
        await validator(payload)

        new SuccessResponse({
            message: 'register success',
            metadata: await AccessService.register(payload)
        }).send(res);
    }

}
export default new AccessController()