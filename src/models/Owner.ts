import {Schema, model} from 'mongoose';

const OwnerSchema = new Schema({
    ownerName: {type: String, required:true, unique:true},
    fullName: {type: String, required:true},
    email: {type: String, required:true},
    password: {type: String, required:true},
    creationDate: {type: Number, default:Date.now},
    listRestaurants:[] //Array containing the IDs of the restaurants.
})


export default model('Owner', OwnerSchema);