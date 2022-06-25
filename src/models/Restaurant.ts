import mongoose, { Schema, model } from 'mongoose'

const GeoJSON = new Schema({
  type: {
    type: String,
    enum: ['Point']
  },
  coordinates: {
    type: [Number],
    index: true
  }
})

const RestaurantSchema = new Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'Owner' }, // The _id of the owner.
  restaurantName: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  description: { type: String, required: true },
  photos: [{ type: String }], // List of URLs. The photos will be stored in the server.
  rating: [{
    rating: { type: Number },
    votes: { type: Number },
    total: { type: Number }
  }],
  occupation: { type: Number },
  statsLog: [{
    date: { type: Date },
    rating: { type: Number },
    occupation: { type: Number }
  }],
  creationDate: { type: Date, default: Date.now },
  listTags: [{
    tagName: { type: String }
  }],
  listDishes: [], // Array containing the IDs of the menus.
  location: GeoJSON
})

// RestaurantSchema.index({ location: '2dsphere' })
// RestaurantSchema.index({ geometry: '2dsphere' })

export default model('Restaurant', RestaurantSchema)
