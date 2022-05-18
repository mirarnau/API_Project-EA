import mongoose from 'mongoose';
import {Schema, model} from 'mongoose';

const TicketSchema = new Schema({
    creatorName: {type: String, required:true}, //Genarally the creator will be a customer
    recipientName: {type: String, required:true}, //The owner of the particular restaurant
    subject: {type: String, required:true}, 
    message: {type:String, required:true},
    profilePicCreator: {type: String, required:true},
    status: {type: Boolean, required: true, default:false}, //False meaning opened (true meaning closed)
    creationDate: {type: Date, default:Date.now},
})

export default model('Ticket', TicketSchema);