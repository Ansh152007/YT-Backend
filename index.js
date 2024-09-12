import dotenv from "dotenv";
import ConnectDB from "./DB/database.js";
dotenv.config({path:"./config.env"})
ConnectDB
const PORT = process.env.PORT || 5000;

.then(()=>{
  app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)}
})