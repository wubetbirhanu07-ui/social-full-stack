import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    author: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

const Post = new mongoose.model('Post', postSchema)

export default Post