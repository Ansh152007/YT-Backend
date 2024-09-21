import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";

cloudinary.config({ 
    cloud_name: process.env.ClOUDINARY_CLOUD_NAME , 
    api_key: process.env.ClOUDINARY_API_KEY, 
    api_secret: process.env.ClOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
});

const uploadToCloudinary = async (file) => {
    try {
        if(!file) return null
        //upload file on cloudinary
        const response = await cloudinary.uploader.upload(file,{
            resource_type: "auto"
        })
        // file has been uploaded successfully
        console.log("file uploaded successfully")
        console.log(response.url);
        return response
    } catch (error) {
        fs.unlinkSync(file) // removes the usesless cluttered file
        return null
    }
}