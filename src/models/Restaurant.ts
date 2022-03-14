import {Schema, model} from 'mongoose';

const RestaurantSchema = new Schema({
    id: {type: Number, required:true, unique:true},
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
    menu:[{  //Each entry is a dish.
        name:{type:String},
        type:{type:String}, //Appetizer, main, dessert, etc.
        description:{type:String},
        price:{type:Number},
        rating:{type:Number}
    }]
})

export default model('Restaurant', RestaurantSchema);