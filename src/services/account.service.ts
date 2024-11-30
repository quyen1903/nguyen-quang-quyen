import crypto from 'node:crypto';
import Account, {IAccount} from '../models/account.model';
import { BadRequestError, ForbiddenError, AuthFailureError } from "../core/error.response";
import KeyTokenService from './keyToken.service';
import { createTokenPair } from '../auth/authUtils';
import { convertToObjectIdMongodb, getInfoData } from '../shared/utils';
import { ChangePasswordDTO } from '../dto/account.dto';
import { Types } from 'mongoose';
import { IAccountRegister,IAccountUpdate, IAccountBase } from '../shared/interface/account.interface';
import { IJWT } from '../shared/interface/jwt.interface';
import { IKeyToken } from '../models/keytoken.model';
import { fullTextSearch, findUsername, findUserById, deleteUserById } from '../repositories/account.repository';


class AccessService{
    private static generateKeyPair(){
        const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa',{
            modulusLength:4096,
            publicKeyEncoding:{
                type:'pkcs1',
                format:'pem'
            },
            privateKeyEncoding:{
                type:'pkcs1',
                format:'pem'
            }
        })
        return {publicKey, privateKey}
    };

    private static async validatePassword(password: string, salt: string, storedPassword: string): Promise<boolean> {
        const derivedKey = await new Promise<Buffer>((resolve, reject) => {
            crypto.pbkdf2(password, salt, 100, 64, 'sha512', (err, derivedKey) => {
                if (err) reject(err);
                resolve(derivedKey);
            });
        });
    
        return derivedKey.toString('hex') === storedPassword;
    }

    static deleteAccount = async( keyStore: IKeyToken )=>{
        const id = keyStore.userId
        await this.logout(keyStore)
        return deleteUserById(id)
    }

    static readAccount = async(keyStore: IKeyToken)=>{
        const id = keyStore.userId
        const result = await findUserById(id);
        return getInfoData(['username','fullname', 'avatar', 'status'],result!)
    }

    static searchAccount = async( keySearch: string)=>{
        const foundUser = await fullTextSearch(keySearch)

        const result = foundUser.map((x)=>{
            return getInfoData(['fullname', 'avatar', 'status'],x)
        })
        return result
    }

    static updateAccount = async(keyStore: IKeyToken,payload: IAccountUpdate)=>{
        if(payload.username){
            const userHolder = await findUsername(payload.username);
            if(userHolder) throw new BadRequestError('username already existed');    
        }

        const replacement = payload, options = {new: true}//return updated result, by default return old result

        const updateAccount = await Account.findByIdAndUpdate(keyStore.userId,replacement, options);
        return getInfoData(['fullname', 'avatar', 'status'], updateAccount!)
    }

    static changePassword = async (keyStore: IKeyToken, { password, newPassword }: ChangePasswordDTO) => {
        const foundUser = await findUserById(keyStore.userId);
        if (!foundUser) throw new BadRequestError('something was wrong, please relogin');
    
        const isPasswordValid = await this.validatePassword(password, foundUser.salt, foundUser.password);
        if (!isPasswordValid) throw new AuthFailureError('wrong password !!!');

        const salt = crypto.randomBytes(32).toString()
        const passwordHashed = crypto.pbkdf2Sync(newPassword,salt,100,64,'sha512').toString('hex')  

        const filter = {_id: foundUser._id},
        replacement = {
            salt,
            password: passwordHashed
        },
        options = {new: true}//return updated result, by default return old result
        const result = await Account.findByIdAndUpdate(filter,replacement, options)
        return getInfoData(['fullname', 'status'], result!) 
    }

    static handleRefreshToken = async( keyStore: IKeyToken,user: IJWT, refreshToken: string )=>{
        /**
         * 1 check keystore existed or not
         * 2 check wheather user's token been used or not, if been used, remove key and for them to relogin
         * 3 if user's token is not valid token, force them to relogin, too
         * 4 if this accesstoken is valid, create new accesstoken, refreshtoken
         * 5 update keytoken in database
        */

        console.log('keystore',typeof(keyStore))

        //1
        const {userId, username} = user;

        if(keyStore.refreshTokensUsed.includes(refreshToken)){
            await KeyTokenService.deleteKeyByUserId(userId)
            throw new ForbiddenError('refresh token already used, please relogin')
        }

        if(keyStore.refreshToken !== refreshToken)throw new AuthFailureError('something was wrong happended, please relogin')
        const foundAccount = await findUserById(convertToObjectIdMongodb(userId))
        if(!foundAccount) throw new AuthFailureError('user not registed');

        //3
        const { publicKey, privateKey } = this.generateKeyPair()
        const tokens = await createTokenPair({userId,username: foundAccount.username},publicKey,privateKey)

        //4
        await keyStore.updateOne({
            $set:{//replace value of field with specific value
                publicKey,
                refreshToken:tokens.refreshToken
            },
            $addToSet:{//adds a value to an array unless the value is already present, in which case it does nothing to array
                refreshTokensUsed:refreshToken
            }
        })

        return {
            user:getInfoData(['userId','username'],foundAccount),
            tokens  
        }
    };

    static logout = async( keyStore: IKeyToken )=>{
        const delKey = await KeyTokenService.removeKeyById(keyStore._id as Types.ObjectId);
        return delKey 
    };

    static login = async ({ username, password }: IAccountBase) => {
        // 1. Check username
        const foundUser = await findUsername(username);
        if (!foundUser) throw new BadRequestError('user not registed');
    
        // 2. Validate password
        const isPasswordValid = await this.validatePassword(password, foundUser.salt, foundUser.password);
        if (!isPasswordValid) throw new AuthFailureError('wrong password !!!');
    
        // 3. Generate key pair
        const { publicKey, privateKey } = this.generateKeyPair();
    
        // 4. Create token pair
        const { _id: userId } = foundUser;
        const tokens = await createTokenPair(
            { userId: userId.toString(), username },
            publicKey,
            privateKey
        );
    
        // 5. Store key and token
        await KeyTokenService.createKeyToken({
            userId: foundUser._id,
            publicKey,
            refreshToken: tokens.refreshToken,
        });
    
        // 6. Return user info and tokens
        return {
            user:getInfoData(['_id','username'],foundUser),
            tokens,
        };
    };
    

    static async register({fullname, username, password, avatar}: IAccountRegister){

        //1 check account existed or not
        const userHolder = await findUsername(username);
        if(userHolder) throw new BadRequestError('user already existed');

        //2
        const salt = crypto.randomBytes(32).toString()
        const passwordHashed = crypto.pbkdf2Sync(password,salt,100,64,'sha512').toString('hex')

        //3
        const newUser = await Account.create({fullname, salt, username, password:passwordHashed, avatar})

        if(newUser){
            //4
            const { publicKey, privateKey } = this.generateKeyPair();
            const tokens =await createTokenPair({
                userId: newUser._id.toString(),
                username: newUser.username
            }, publicKey, privateKey)
            if(!tokens)throw new BadRequestError('create tokens error!!!!!!')

            //5
            const keyStore = await KeyTokenService.createKeyToken({
                userId: newUser._id,
                publicKey
            })
            if(!keyStore) throw new Error('cannot generate keytoken');

            return{
                user:getInfoData(['_id','username'],newUser),
                tokens
            }
        }
        return {
            code:200,
            metadata:null
        }
    }
}

export default AccessService