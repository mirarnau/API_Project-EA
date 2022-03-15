import {Schema, model} from 'mongoose';

const RestaurantSchema = new Schema({
    id: {type: Number, required:true, unique:true},
    idOwner:{type:String, required:true},
    restaurantName: {type: String, required:true, unique:true},
    email: {type: String, required:true},
    address: {type: String, required:true},
    description: {type: String, required:true},
    photos:[],//List of URLs. The photos will be stored in the server.
    rating: {type: Number},
    owner: {type:String, required:true},
    creationDate: {type: Date, default:Date.now},
    listTags:[{
        tagName:{type:String} 
    }],
    listMenus:[] //Array containing the IDs of the menus.
})

export default model('Restaurant', RestaurantSchema);