import mongoose from 'mongoose';
import {Schema, model} from 'mongoose';

const MessageSchema = new Schema({
    senderName: {type: String, required:true}, 
    receiverName: {type: String, required:true}, 
    message: {type:String, required:true},
    profilePicSender: {type: String, required:true},
    creationDate: {type: Date, default:Date.now},
})

export default model('Message', MessageSchema);