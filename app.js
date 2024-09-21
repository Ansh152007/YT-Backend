import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}))
app.use(express.json({limit:"200kb"}))
app.use(express.urlencoded({extended:true, limit:"200kb"}))
app.use(express.static("public"))
app.use(cookieParser())

// routes import
import router from "./routes/user.route.js";

// route declaration
app.use("/users", router)

export default app