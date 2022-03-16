import {Schema, model} from 'mongoose';

const ReservationSchema = new Schema({
    id: {type: Number, required:true, unique:true},
    idCustomer: {type:String, required:true},
    idRestaurant: {type:String, required:true},
    dateReservation: {type:String, required:true},
    timeReservation: {type:String, required:true},
    creationDate: {type: Date, default:Date.now}
})

export default model('Reservation', ReservationSchema);