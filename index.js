import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { client } from "./db/db.js";
import { SigninRouter } from "./routes/login.js";
import { ForgotPasswordRouter } from "./routes/forgotpassword.js";


//config for env 
dotenv.config()
// server Started 
const app=express()
const port=process.env.port;

//database Connection Check
client()

//Middleware
app.use(express.json())
app.use(cors())
app.use(cookieParser())


// application routes
app.use('/',SigninRouter)
app.use('/forgotpassword',ForgotPasswordRouter)






// listening Server
app.listen(port,() => {
    console.log(`Server Started in localhost:${port}`);
  })