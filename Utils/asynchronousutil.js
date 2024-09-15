import { response } from "express"


const asynchandler = (requestHandler) =>(req,res,next)=>{
Promise.resolve(requestHandler(req,res,next)).catch((err)=>(next(err)))
}



export default asynchandler