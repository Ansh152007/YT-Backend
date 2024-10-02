
import ApiError from "../Utils/ApiError.js"
import asynchandler from "../Utils/asynchronousutil.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../Utils/cloudinary.js"
import ApiResponse from "../Utils/ApiResponse.js"
import jwt from "jsonwebtoken";
import { json } from "stream/consumers"

const generateAccessAndRefreshToken = async (userId) => {
    try {

        const user = await User.findById(userId)
        const AccessToken = user.generateAccessToken()
        const RefreshToken = user.generateRefreshToken()

        user.refreshToken = RefreshToken
        await user.save({ validateBeforeSave: false })
        return { AccessToken, RefreshToken }

    } catch (error) {
        throw new ApiError(500, "Something Went Wrong at our end while generating Access and Refresh Token")
    }
}

const registerUser = asynchandler(async (req, res) => {
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
    const { fullName, username, email, password } = req.body
    // console.log("Email:",email)

    if ([fullName, username, email, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required!");

    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    // console.log(existedUser)

    if (existedUser) {
        throw new ApiError(409, "User Already Exist")
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
        throw new ApiError(500, "Something Went Wrong")
    }

    return res.status(201).json(
        new ApiResponse(200, CreatedUser, "User Created Successfully")
    )
})

const loginUser = asynchandler(async (req, res) => {
    // Get data from frontend
    // Username or Email
    // Find User
    // Password Verification
    // Access and Refresh Token
    // Send Cookie

    const { email, username, password } = req.body

    if (!(username || email)) {
        throw new ApiError(400, "Username or Email is required")
    }

    const user = await User.findOne({
        $or: [{ email }, { username }]
    })

    if (!user) {
        throw new ApiError(404, "User nor found")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(400, "Password is Invalid")
    }
    const { AccessToken, RefreshToken } = await generateAccessAndRefreshToken(user._id)
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .cookie("AccessToken", AccessToken, options)
        .cookie("RefreshToken", RefreshToken, options)
        .json(
            new ApiResponse(
                200, {
                user: loggedInUser, AccessToken, RefreshToken
            },
                "User loggedIn Successfully"
            )
        )
})

const logoutUser = asynchandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: { refreshToken: 1 }
        },
        {
            new: true
        }
    )

    const Options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("AccessToken", Options)
        .clearCookie("RefreshToken", Options)
        .json(new ApiResponse(200, {}, "User logged Out Successfully"))
})

const refreshAccessToken = asynchandler(async (req, res) => {
    try {
        const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
    
        if (!incomingRefreshToken) {
            throw new ApiError(401,"Unauthorized Request")
        }
    
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
    
        const user = User.findById(decodedToken?._id)
        
        if (!user) {
            throw new ApiError(401,"Invalid Refresh Token")
        }
    
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401,"Refresh Token is expired or used")
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const {AccessToken,RefreshToken} = await generateAccessAndRefreshToken(User._id)
    
        return res
        .status(200)
        .cookie("AccessToken", AccessToken,options)
        .cookie("RefreshToken",RefreshToken,options)
        .json(
            new ApiResponse(
                200,
                {AccessToken, RefreshToken}
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Refresh Token")
    }
})

const UpdatePassword = asynchandler(async (req, res)=>{
    const {oldPassword, newPassword}= req.body

    const user = await User.findById(req.user?._id)
    const checkpassword = await user.isPasswordCorrect(oldPassword)

    if (!checkpassword) {
        throw new ApiError(400,"Invalid Password")
    }

    user.password = newPassword
    await user.save({ validateBeforeSave : false})

    return res.status(200,json(new ApiResponse(200, {}, "Password is Changed Successfully")))
})

const 
export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    UpdatePassword
}