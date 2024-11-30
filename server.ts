import app from './src/app'
import enviroment from './src/configs/config.mongodb'
const PORT = enviroment.app.port

const server = app.listen(PORT,()=>{
    console.log(`CRUDE start with port ${PORT}`)
})
