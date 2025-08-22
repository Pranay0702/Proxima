import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true
  },
  content: {type: String, required: true, trim: true},
  image: {type: String},
  likes: {type: Number, default: 0},
  comments: [{author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    message: String,
    createdAt: { type: Date, default: Date.now }}],
  createdAt: {type: Date, default: Date.now}
});

const Post = mongoose.model('Post', postSchema);
export default Post;
