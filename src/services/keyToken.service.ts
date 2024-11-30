import { Types } from "mongoose";
import Key,{ IKeyToken } from "../models/keytoken.model";


class KeyTokenService{

    static createKeyToken = async ({userId, publicKey, refreshToken}:Partial<IKeyToken>)=>{
        try {
            const filter = {userId:userId},
            replacement = {
                publicKey,refreshTokensUsed:[],refreshToken
            },
            options = {upsert:true,new:true}

            const tokens = await Key.findOneAndUpdate(filter,replacement,options);
            return tokens ? tokens.publicKey : null
        } catch (error) {
            return error
        }
    }
    
    static findKeyByUserId = async (userId: string | Types.ObjectId)=> {
        return await Key.findOne({ userId: userId });
    }


    static removeKeyById = async(id: Types.ObjectId)=>{
        return await Key.deleteMany({_id:id})
    }
    
    static findByRefreshTokenUsed = async(refreshToken: IKeyToken['refreshToken'])=>{
        return await Key.findOne({refreshTokensUsed:refreshToken})
    }

    static findByRefreshToken = async(refreshToken: IKeyToken['refreshToken'])=>{
        return await Key.findOne({refreshToken})
    }

    static deleteKeyByUserId = async(userId: string)=>{
        return await Key.deleteMany({userId:userId})
    }
}

export default KeyTokenService