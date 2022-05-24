import mongoose, { Schema, model } from 'mongoose'

import Restaurant from './Restaurant'

const OwnerSchema = new Schema({
  ownerName: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  creationDate: { type: Date, default: Date.now },
  listRestaurants: [{ type: mongoose.Schema.Types.ObjectId, ref: Restaurant }], // Array containing the IDs of the restaurants.
  role: { type: [String], default: ['OWNER'] }
})

export default model('Owner', OwnerSchema)
