import mongoose from 'mongoose';
import {Schema, model} from 'mongoose';

const DishSchema = new Schema({  //Each entry is a dish.
    restaurant: {type:mongoose.Schema.Types.ObjectId, ref:"Restaurant", required:true},
    title:{type:String, required:true},
    type:{type:String, required:true}, //Appetizer, main, dessert, etc.
    description:{type:String, required:true},
    price:{type:String, required:true},
    imageUrl: {type:String},
    rating:{type:Number}
})

export default model('Menu', DishSchema);