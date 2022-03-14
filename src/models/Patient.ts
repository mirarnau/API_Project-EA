import {Schema, model} from 'mongoose';

const PatientSchema = new Schema({
    name: {type: String, required:true},
    email: {type: String, required:true},
    password: {type: String, required:true},
    creationDate: {type: Date, default:Date.now}
})

export default model('Patient', PatientSchema);