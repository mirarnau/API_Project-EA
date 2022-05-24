import mongoose, { Schema, model } from 'mongoose'

const RestaurantSchema = new Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'Owner' }, // The _id of the owner.
  restaurantName: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  description: { type: String, required: true },
  photos: [{ type: String }], // List of URLs. The photos will be stored in the server.
  rating: { type: Number },
  creationDate: { type: Date, default: Date.now },
  listTags: [{
    tagName: { type: String }
  }],
  listDishes: [] // Array containing the IDs of the menus.
})

export default model('Restaurant', RestaurantSchema)
