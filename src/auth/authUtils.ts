import JWT from 'jsonwebtoken'
import asyncHandler from '../shared/helper/async.handler'
import { Request, Response, NextFunction } from 'express'
import { AuthFailureError, NotFoundError, BadRequestError } from '../core/error.response'
import  KeyTokenService  from '../services/keyToken.service';
import { IJWT } from '../shared/interface/jwt.interface'


const HEADER ={
    API_KEY : 'x-api-key',
    CLIENT_ID:'x-client-id',
    AUTHORIZATION:'authorization',
    REFRESHTOKEN:'refreshtoken',
}

export const createTokenPair = async(payload:{
    userId: string, 
    username: string
}, publicKey: string, privateKey: string)=>{
    try {
        const accessToken =  JWT.sign(payload,privateKey,{
            expiresIn:'6h',
            algorithm:'RS256'
        })
        const refreshToken=  JWT.sign(payload,privateKey,{
            expiresIn:'7 days',
            algorithm:'RS256'
        })
    
        JWT.verify(accessToken,publicKey,(err,decode)=>{
            if(err){
                throw new BadRequestError(' JWT verify error :::')
            }else{
                console.log(`decode verify`,decode)
            }
        })
        return {accessToken,refreshToken}
    } catch (error) {
        console.log('Authentication Utilities error:::',error)
        throw new BadRequestError('Error creating token pair');
    }
}

export const authentication = asyncHandler(async(req:Request, res: Response, next: NextFunction)=>{

    //1
    const userId = req.headers[HEADER.CLIENT_ID] as string
    if(!userId) throw new AuthFailureError('Invalid Request, missing client ID')    

    //2
    const keyStore = await KeyTokenService.findKeyByUserId(userId)
    if(!keyStore) throw new NotFoundError('Not Found Keystore')

    //3
    if(req.headers[HEADER.REFRESHTOKEN]){
        try {
            const refreshToken = req.headers[HEADER.REFRESHTOKEN] as string
            const decodeUser = JWT.verify(refreshToken ,keyStore.publicKey) as IJWT
            if(userId !== decodeUser.userId.toString() ) throw new AuthFailureError('Invalid User Id')
            req.keyStore = keyStore
            req.user = decodeUser
            req.refreshToken = refreshToken
            return next()
        } catch (error) {
            throw error
        }
    }

    //4
    const accessToken = req.headers[HEADER.AUTHORIZATION] as string
    if(!accessToken) throw new AuthFailureError('Invalid Request')

    try {
        const decodeUser = JWT.verify(accessToken,keyStore.publicKey) as IJWT
        if( userId !== decodeUser.userId.toString() ) throw new AuthFailureError('Invalid User Id');
        req.keyStore = keyStore
        req.user = decodeUser
        return next()
    } catch (error) {
        throw error
    }
})

export async function verifyJWT(token: string, publicKey: string){
    return JWT.verify(token, publicKey)
} 
