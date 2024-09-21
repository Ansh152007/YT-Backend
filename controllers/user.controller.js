import { json } from "stream/consumers"
import asynchandler from "../Utils/asynchronousutil.js"

const registerUser = asynchandler( async (req,res)=> {
    res.status(200).json({
        message : "ok"
    })
})

export default registerUser