import dotenv from "dotenv";
import ConnectDB from "./DB/database.js";

dotenv.config({path:"./config.env"})
const PORT = process.env.PORT || 5000;

ConnectDB()
.then(()=>{
  app.listen(PORT, ()=>console.log(`Server running on port ${PORT}`))
}).catch(error=>console.log(error))
