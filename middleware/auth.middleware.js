import jwt from "jsonwebtoken";
import ApiError from "../Utils/ApiError.js";
import asynchandler from "../Utils/asynchronousutil.js";
import { User } from "../models/user.model.js";

export const verifyJWT = asynchandler(async(req, _ /* when res is not in use*/, next)=>{
   try {
    const token = req.cookies?.AccessToken || req.header("Authorization").replace("Bearer ","")
 
    if (!token) {
     throw new ApiError(401, "Unotherized Request")
    }
 
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    const user = User.findById(decodedToken?._id).select("-password -refreshToken")
 
    if (!user) {
     throw new ApiError(401,"Invalid Access Token")
    }
 
    req.user = user;
    next()
   } catch (error) {
    throw new ApiError(401, error?.message || "Failed to run auth middleware")
   }
})