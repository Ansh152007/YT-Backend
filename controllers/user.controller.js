import ApiError from "../Utils/ApiError.js"
import asynchandler from "../Utils/asynchronousutil.js"
import User from "../models/user.model.js"

const registerUser = asynchandler( async (req,res)=> {
    // Get data from frontend
    // Validation - not empty
    // Check if user already exists: Username,email
    // Check for images/avatar
    // Upload to cloudinary
    // Create user object - create entry in db
    // Remove password and refresh token field from response
    // Check for user creation
    // Return response

const{fullName,username,email,password}= req.body
    console.log("Email:",email)

    if([fullName,username,email,password].some((field)=> field?.trim() ==="")){
        throw new ApiError(400,"All fields are required!");
        
    }

    User.findOne({
        $or : [{username},{email}]
    })
})

export default registerUser