import express from 'express'

const router = express.Router()

import Post from '../models/Post.js'

import { authMiddleware } from '../utils/auth.js'

router.use(authMiddleware)

router.post('/', async (req, res) => {
    try {
        // NOTE: our post needs to know what user it's related to...
        const post = await Post.create({
            ...req.body,
            author: req.user._id
        })

        // turn the author field from an id into a user document (that includes the username)
        await post.populate('author', 'username')

        res.status(200).json(post)
    } catch(err) {
        console.log(err.message)
        res.status(400).json({ message: err.message })
    }
})

router.get('/', async (req, res) => {
    try {
        // this gets all posts, but you can filter posts based of logged in user: { author: req.user._id }
        const posts = await Post.find({})
                                .sort({ createdAt: -1 })
                                // turn the author field from an id into a user document (that includes the username)
                                .populate('author', 'username')
        res.status(200).json(posts)
    } catch(err) {
        console.log(err.message)
        res.status(400).json({ message: err.message })
    }
})

export default router