interface Config{
    app:{port: number},
    db:{
        host:string,
        port:number,
        name:string
    }
}

const dev: Config = {
    app:{
        port: Number(process.env.DEV_APP_PORT) || 3052
    },
    db:{
        host: (process.env.DEV_DB_HOST) || 'localhost',
        port: Number(process.env.DEV_DB_PORT) || 27017,
        name: (process.env.DEV_DB_NAME) || 'crude-dev'
    }
}
const pro: Config = {
    app:{
        port: Number(process.env.PRO_APP_PORT) || 3000
    },
    db:{    
        host: (process.env.PRO_DB_HOST) ||'localhost',
        port: Number(process.env.PRO_DB_PORT) || 27017,
        name: (process.env.PRO_DB_NAME) || 'crude-pro'
    }
}

const config = { dev,pro };
type Enviroment = 'dev' | 'pro';
const env: Enviroment = (process.env.NODE_ENV as Enviroment) || 'dev';
console.log('config env',config[env])
export default config[env]