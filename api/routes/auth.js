import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()
import express from "express";
//const {register,login,logout}=require("")
import {register,login,logout} from "../controll/Auth.js"
const router = express.Router();

router.post("/register",register);

router.post("/login",login);
router.post("/logout",logout);

export default router;

