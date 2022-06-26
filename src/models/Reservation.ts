import mongoose, { Schema, model } from 'mongoose'

const ReservationSchema = new Schema({
  _idCustomer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
  _idRestaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
  numCustomers: { type: Number, required: true },
  phone: { type: String, required: true },
  dateReservation: { type: String, required: true },
  timeReservation: { type: String, required: true },
  creationDate: { type: Date, default: Date.now }
})

export default model('Reservation', ReservationSchema)
