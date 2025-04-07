import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express()

app.use(cors({}))

app.use(express.json({
  limit: "10mb",
}))

app.use(express.urlencoded({
  extended: true,
  limit: "10mb"
}))

app.use(express.static("public"))

app.use(cookieParser())


//routes

import router from './routes/user.route.js'


//routes declaration

app.use("/api/v1", router)


export { app }