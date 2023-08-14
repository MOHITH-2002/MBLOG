import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()
import mysql from "mysql2";
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password:process.env.PASS_WORD,
    database:'blog'
})
export default db;
