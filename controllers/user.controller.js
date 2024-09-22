
import ApiError from "../Utils/ApiError.js"
import asynchandler from "../Utils/asynchronousutil.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../Utils/cloudinary.js"
import ApiResponse from "../Utils/ApiResponse.js"

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

    // console.log(req.body)
const{fullName,username,email,password}= req.body
    // console.log("Email:",email)

    if([fullName,username,email,password].some((field)=> field?.trim() ==="")){
        throw new ApiError(400,"All fields are required!");
        
    }

    const existedUser= await User.findOne({
        $or : [{username},{email}]
    })

    // console.log(existedUser)

    if (existedUser) {
        throw new ApiError(409,"User Already Exist")
    }
    // console.log(req.files)

    const avatarLocalFilePath = req.files?.avatar[0]?.path;
    const coverImageLocalFilePath = req.files?.coverImage[0]?.path;

    if (!avatarLocalFilePath) {
        throw new ApiError(400, "Avatar is Required");
    }
    
    const avatar = await uploadOnCloudinary(avatarLocalFilePath);
    const coverImage = await uploadOnCloudinary(coverImageLocalFilePath);
    if (!avatar) {
    throw new ApiError(400, "Avatar is Required");
    }

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

   const CreatedUser = await User.findById(user._id).select("-password -refreshToken")

   if (!CreatedUser) {
    throw new ApiError(500,"Something Went Wrong")
   }

   return res.status(201).json(
    new ApiResponse(200, CreatedUser, "User Created Successfully")
   )
})

export {registerUser}