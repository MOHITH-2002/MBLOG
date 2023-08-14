import express from "express";
import {Posts,getPost,deletePost,addPost,updatePost} from "../controll/post.js"
const router = express.Router();

router.get("/",Posts);
router.get("/:id",getPost);
router.delete("/:id",deletePost);
router.post("/",addPost);
router.put("/:id",updatePost);



       
export default router;