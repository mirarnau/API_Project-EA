import {Schema, model} from 'mongoose';

const PsychologistSchema = new Schema({
    name: {type: String, required:true},
    email: {type: String, required:true},
    password: {type: String, required:true},
    creationDate: {type: Date, default:Date.now},
    subjects: [{
        type: Schema.Types.ObjectId
    }]

})

export default model('Patient', PsychologistSchema);