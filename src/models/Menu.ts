import {Schema, model} from 'mongoose';

const MenuSchema = new Schema({  //Each entry is a dish.
    idMenu: {type:String, required:true},
    idOwner: {type:String, required:true},
    name:{type:String},
    type:{type:String}, //Appetizer, main, dessert, etc.
    description:{type:String},
    price:{type:Number},
    rating:{type:Number}
})

export default model('Menu', MenuSchema);