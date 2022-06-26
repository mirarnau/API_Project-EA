import mongoose, { Schema, model } from 'mongoose'

const ReservationSchema = new Schema({
  _idCustomer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
  restaurantName: { type: String, required: false },
  dateReservation: { type: String, required: true },
  timeReservation: { type: String, required: true },
  creationDate: { type: Date, default: Date.now }
})

export default model('Reservation', ReservationSchema)
