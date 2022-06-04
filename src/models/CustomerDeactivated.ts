import mongoose, { Schema, model } from 'mongoose'

const CustomerDeactivatedSchema = new Schema({
  customerName: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  creationDate: { type: Date, default: Date.now },
  profilePic: { type: String },
  listTastes: [{
    tagName: { type: String },
    relevance: { type: Number } // This value will be dynamically updated with the user activity.
  }],
  listDiscounts: [{
    nameRestaurant: { type: String },
    amount: { type: Number },
    expirationDate: { type: String }
  }],
  listReservations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reservation' }], // Array containing the IDs of the reservations of the customer.
  role: { type: [String], default: ['CUSTOMER'] }
})

export default model('CustomerDec', CustomerDeactivatedSchema)
