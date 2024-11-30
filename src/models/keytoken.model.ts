import { model, Schema, Document, Types }  from "mongoose";

export interface IKeyToken extends Document{
    userId: Types.ObjectId;
    publicKey: string;
    refreshTokensUsed: string[];
    refreshToken: string;
}

const DOCUMENT_NAME='Key'
const COLLECTION_NAME='Keys'
// Declare the Schema of the Mongo model


const keyTokenSchema:Schema =new Schema<IKeyToken>({
    userId:{ type: Schema.Types.ObjectId, required:true, ref:'Shop' },
    publicKey:{ type:String, required:true },
    refreshTokensUsed:{ type:[String], default:[] as string[] },
    refreshToken: {type:String, required:true }

},{
    collection:COLLECTION_NAME,
    timestamps:true
});

//Export the model
export default model<IKeyToken>(DOCUMENT_NAME, keyTokenSchema);