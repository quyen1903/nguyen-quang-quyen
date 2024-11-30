import{model,Schema,Types} from'mongoose';

const DOCUMENT_NAME='Account'
const COLLECTION_NAME='Accounts'

export interface IAccount extends Document{
    username: string;
    fullname: string,
    salt: string;
    password: string;
    avatar: string,
    status: 'active' | 'inactive';
};
// Declare the Schema of the Mongo model
const accountSchema: Schema = new Schema<IAccount>({
    username:{ type:String, trim:true, maxLength:150, unique: true },
    fullname:{ type: String, require: true},
    salt:{ type:String, required:true },
    password:{ type:String, required:true },
    avatar:{ type:String, required:true },
    status:{ type:String, enum:['active','inactive'], default:'active'},
},{
    timestamps:true,
    collection:COLLECTION_NAME
}
);

accountSchema.index({ fullname: 'text' });

//Export the model
export default model<IAccount>(DOCUMENT_NAME, accountSchema);