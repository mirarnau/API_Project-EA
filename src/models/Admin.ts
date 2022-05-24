import { Schema, model } from 'mongoose'

const AdminSchema = new Schema({
  adminName: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  creationDate: { type: Date, default: Date.now },
  role: { type: [String], default: ['ADMIN'] }
})

export default model('Admin', AdminSchema)
