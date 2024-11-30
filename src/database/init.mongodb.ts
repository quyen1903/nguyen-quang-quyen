import mongoose from "mongoose";
import config from "../configs/config.mongodb"
import CheckConnect from "../shared/helper/check.connect";
const { host, port, name } = config.db;
const connectString = `mongodb://${host}:${port}/${name}`
console.log(connectString)

class Database{
    private static instance: Database;
    private constructor(){
        this.connect()
    }

    private connect(type: string = 'mongodb'): void{
        if(1 === 1){
            mongoose.set('debug',true);
            mongoose.set('debug',{color:true})
        }
        mongoose.connect(connectString,{
            maxPoolSize:50
        })
        .then( _=>console.log('connected mongodb success pro'),CheckConnect.countConnect)
        .catch(err=>console.log(`Err connect!`))
    }

    public static getInstance(): Database{
        if(!Database.instance){
            Database.instance = new Database
        }
        return Database.instance
    }
}


const instanceMongodb = Database.getInstance()
export default instanceMongodb;