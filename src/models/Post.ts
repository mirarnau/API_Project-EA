import { Schema, model } from 'mongoose'

const PostSchema = new Schema({
  creator: { type: String, required: true },
  profileImage: { type: String, required: true },
  description: { type: String, required: true },
  comments: [{
      creatorName: { type: String },
      message: { type: String }
  }],
  likes: [{
    customerName: { type: String },
    number: { type: Number }
   }],
  postImageUrl: { type: String }
})

export default model('Post', PostSchema)
