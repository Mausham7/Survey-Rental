import dotenv from "dotenv";
import {connectDB} from "./db/index.js";
import { app } from "./app.js";


dotenv.config({
  path: './.env'
})



connectDB()

  .then(() => {
    app.on("error", (error) => {
      console.log("ERR: ", error)
      throw error
    })
    app.listen(process.env.PORT || 8000, () => {
      console.log(`SERVER is running at port : ${process.env.PORT
        }`)
    })
    // const admin = await Admin.findOne({})
  })
  .catch((err) => {
    console.log("MONGODB Connection failed !!", err);
  })