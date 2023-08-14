import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()
import express, { query } from 'express';
import bcrypt  from "bcryptjs";
import db from '../db.js';
import jwt from "jsonwebtoken";

// import { on } from 'events';

const register = (req,res) => {
    //// we are checking the user is found are not
    const q ="SELECT * FROM users WHERE email = ? OR username= ?";// ? founded
    db.query(q,[req.body.email,req.body.name],function(err,data){
        if(err){
           return res.json(err);
        }
        if(data.length){
            return res.status(409).json("user is already exist!");
        }
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);



////// inserting into the data base
        const qu = "INSERT INTO users (`username`,`email`,`password`) VALUES(?)";
        const values =[
            req.body.username,
            req.body.email,
            hash,////password 
        ]
        db.query(qu,[values],function(err,data){
            if(err)
                return res.json(err);
            
            return res.status(200).json("user as been created");  
        });
        
        
        
    });

}
const login = (req,res) => {

    const q = "SELECT * FROM users WHERE username=?"
    db.query(q,[req.body.username],function(err,data){
        if(err) {
            return res.json(err);
        }
        if(data.length === 0){
            return res.status(404).json("user not found");
        }
        //check password
       const isPasswordCorrect =  bcrypt.compareSync(req.body.password, data[0].password);

       if(!isPasswordCorrect){
        return res.status(400).json("user or password not correct");
       }
       
       //creating token to sign and delete post by owner
       const token = jwt.sign({id:data[0].id},process.env.PASS_WORD)
       const {password ,...other} = data[0]; // left password in db and copy other things in cookie
       res.cookie("access_token", token ,{
        httpOnly: true,
       }).status(200).json(other);
    });
   
}
const logout = (req,res) => {
    res.clearCookie("access_token",{
        sameSite:"none",
        
        secure: true
    }).status(200).json("successfully user has been logout!");
    
}
export {register, login, logout};