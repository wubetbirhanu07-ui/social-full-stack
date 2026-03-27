import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const router = express.Router()

import User from '../models/User.js'

import { authMiddleware } from '../utils/auth.js'

const secret = process.env.JWT_SECRET
const expiration = '24h'

router.post('/register', async (req, res) => {
    try {

        const saltRounds = 10

        // hash password first
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds)

        const user = await User.create({
            ...req.body,
            password: hashedPassword
        })

        const payload = { 
            username: user.username,  
            email: user.email,
            _id: user._id
        }

         // create a token
        const token = jwt.sign({ data: payload }, secret, { expiresIn: expiration })

        res.status(201).json({ token, user })

    } catch(err) {
        console.log(err.message)
        res.status(400).json({ message: err.message })
    }

})

router.post('/login', async (req, res) => {

    try {
        // find the user
        const user = await User.findOne({ email: req.body.email })

        // check if the user exists
        if (!user) {
            return res.status(400).json({ message: 'Incorrect email or password' })
        }

        // check the password
        const correctPassword = await bcrypt.compare(req.body.password, user.password)

        if (!correctPassword) {
            return res.status(400).json({ message: 'Incorrect email or password' })
        }

        // create a token
        const payload = { 
            username: user.username,  
            email: user.email,
            _id: user._id
        }

         // create a token
        const token = jwt.sign({ data: payload }, secret, { expiresIn: expiration })

        res.status(200).json({ token, user })

    } catch(err) {
        console.log(err.message)
        res.status(400).json({ message: err.message })
    }
})

// verify our logged in user's token
router.use(authMiddleware)

// after verification send back the user details (payload)
router.get('/', (req, res) => {
    res.status(200).json(req.user)
})

export default router