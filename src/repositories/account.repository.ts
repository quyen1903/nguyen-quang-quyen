import Account from '../models/account.model';
import { BadRequestError } from '../core/error.response';
import { convertToObjectIdMongodb } from '../shared/utils';
import { Types } from 'mongoose';

export async function findUserById(id: Types.ObjectId){
    return await Account.findById(id)
}

export async function findUsername(username: string){
    return await Account.findOne({username}).select( {username:1, password:1, salt:1}).lean()
}

export async function deleteUserById(id: Types.ObjectId){
    return await Account.findByIdAndDelete(id)
}

export async function fullTextSearch(keySearch: string){
    const result = await Account.find(
        { 
            $text:{
                $search: keySearch
            }
        },{
            score: { $meta: 'textScore' } 
        }
    ).sort({
        score: { $meta: 'textScore' } 
    })
    .lean();
  
    if (!result || result.length === 0) {
      throw new BadRequestError('Name not found, please try again');
    }
  
    return result;
};