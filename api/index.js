import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()
import express from "express"
import postsRoute from "./routes/posts.js"
import authRoute from "./routes/auth.js"
import multer from "multer";
import usersRoute from "./routes/users.js"
const app = express();
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
app.use(bodyParser.urlencoded({ extended: false })); 
app.use(bodyParser.json());
app.use(cookieParser());

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "../client/public/upload");
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + file.originalname);
    },
  });
  
  const upload = multer({ storage });
  
  app.post("/api/upload", upload.single("file"), function (req, res) {
    const file = req.file;
    res.status(200).json(file.filename);
  });
app.use("/api/posts", postsRoute);/// it work like /api/posts/test
app.use("/api/auth", authRoute);/// it work like /api/posts/test
app.use("/api/users", usersRoute);

app.listen(8800,()=>{
    console.log("connected to server");

})
