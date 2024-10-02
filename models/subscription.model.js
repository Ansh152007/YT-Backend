import { channel } from "diagnostics_channel";
import mongoose,{Schema} from "mongoose";
import { type } from "os";

const subscriptionSchema = new Schema({
    subscriber:{
        type: Schema.Types.ObjectId, //One who subscribes
        ref: "User"
    },
    channel :{
        type: Schema.Types.ObjectId, //Whome Subscriber is Subscribing
        ref: "User"
    }
},{timestamps: true})


export const subscription = mongoose.model("subcription", subscriptionSchema)