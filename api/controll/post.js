import express from 'express';
import * as dotenv from 'dotenv' 
dotenv.config()
import db from '../db.js';
import jwt from "jsonwebtoken";

const Posts = (req,res) => {
    const q = req.query.cat ? "SELECT * FROM posts WHERE cat=?" : "SELECT * FROM posts"; // ternary opertor
        // above code select cat from soecfic category : if not select all posts 
        db.query(q,[req.query.cat],function(err,data){
            ///[req.query.cat] is this for ? in SELECT * FROM posts WHERE cat=?
            if(err){
               return res.json(err);//res.send
            }
            return res.status(200).json(data);
        })
    }
const getPost = (req,res) => {
    
    const q =
    "SELECT p.id, `username`, `title`, `disc`, p.img, u.image AS userImg, `cat`,`date` FROM users u JOIN posts p ON u.id = p.uid WHERE p.id = ? ";

  db.query(q, [req.params.id], (err, data) => {
    if (err) return res.status(500).json(err);

    return res.status(200).json(data[0]);
    
  });
}
const deletePost = (req,res) => {
    
    const token = req.cookies.access_token
    if(!token){
        return res.status(401).json("user is not authenticated!");
    }
    jwt.verify(token,process.env.PASS_WORD,function(err,userInfo){ // userinfo means user id in auth.js
        if(err){
            res.status(403).json("tokens are not valid");
        }
        const postId = req.params.id;
        const q = "DELETE FROM posts WHERE `id`=? AND `uid`=?"; // if both id and uid are same then only you will delete
        db.query(q,[postId,userInfo.id],function(err,data){
            if(err){
              return  res.status(403).json("you can delete your posts only");
            }
            return res.json("post has been deleted");
            
        })
    })

}
const updatePost = (req,res) => {
    const token = req.cookies.access_token
    if(!token){
        return res.status(401).json("user is not authenticated!");
    }
    jwt.verify(token,process.env.PASS_WORD,function(err,userInfo){ // userinfo means user id in auth.js
        if(err){
            res.status(403).json("tokens are not valid");
        }
        const Postid = req.params.id;
       const q="UPDATE posts SET `title`=?,`disc`=?,`img`=?,`cat`=? WHERE `id`=? AND `uid`=?";
       const values = [
        req.body.title,
        req.body.disc,
        req.body.img,
        
        req.body.cat,
          
       ]
       db.query(q,[values,Postid,userInfo.id],function(err,data){
        if(err){
            return res.status(500).json(err)
        }
        return res.json("posts has been updated")

       })
    })
}
const addPost = (req,res) => {
    const token = req.cookies.access_token
    if(!token){
        return res.status(401).json("user is not authenticated!");
    }
    jwt.verify(token,process.env.PASS_WORD,function(err,userInfo){ // userinfo means user id in auth.js
        if(err){
            res.status(403).json("tokens are not valid");
        }
       const q="INSERT INTO posts(`title`,`disc`,`img`,`date`,`cat`,`uid`) VALUES (?)";
       const values = [
        req.body.title,
        req.body.disc,
        req.body.img,
        req.body.date,
        req.body.cat,
        userInfo.id /// uid from the function   
       ]
       db.query(q,[values],function(err,data){
        if(err){
            return res.status(500).json(err)
        }
        return res.json("posts has been uploded")

       })
    })
    
}
export {
        Posts,
        getPost,
        deletePost,
        addPost,
        updatePost
}