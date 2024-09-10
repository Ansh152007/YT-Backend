import mongoose from "mongoose";
import DB_NAME from "../constaints.js";
// Connect to MongoDB

const ConnectDB = async () =>
  {
    try{ const ConnectionInstance= await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`Connected to MongoDB /n DB_NAME: ${ConnectionInstance.connection.host}`)
      
    }catch(error){
      console.log("Mongo DB connection failed", error )
      process.exit(1)
    }
  }

export default ConnectDB