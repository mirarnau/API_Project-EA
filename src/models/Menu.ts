import mongoose from 'mongoose';
import {Schema, model} from 'mongoose';

const MenuSchema = new Schema({  //Each entry is a dish.
    owner: {type:mongoose.Schema.Types.ObjectId, ref:"Owner", required:true},
    title:{type:String, required:true},
    type:{type:String, required:true}, //Appetizer, main, dessert, etc.
    description:{type:String, required:true},
    price:{type:String, required:true},
    rating:{type:Number}
})

export default model('Menu', MenuSchema);