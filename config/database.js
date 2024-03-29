import mysql from 'mysql2'
import dotenv from 'dotenv'
dotenv.config()
const db = mysql
const pool = db.createPool({
    host:process.env.HOST,
    user:'root',
    database:process.env.DATABASE,
    password:process.env.PASSWORD,
    port:process.env.DBPORT,
    waitForConnections: true,
})
pool.getConnection((err)=>{
    if(err){
        console.log(err)
    }else{
        console.log('connected')
    }
})

export default pool


