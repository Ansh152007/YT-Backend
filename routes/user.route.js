import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js"
import { loginUser, logoutUser, refreshAccessToken, registerUser, UpdatePassword } from "../controllers/user.controller.js"
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router()
router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
)
router.route("/login").post(loginUser)

// Secured Routes
router.route("/logout").post(verifyJWT,logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/updatepassword").post(verifyJWT, UpdatePassword)
export default router