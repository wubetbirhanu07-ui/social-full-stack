import jwt from 'jsonwebtoken'

const secret = process.env.JWT_SECRET

export async function authMiddleware(req, res, next) {

    try {
        let token = req.headers.authorization

        // check if there's a token
        if (!token) {
            return res.status(403).json({ message: "No token provided" })
        }
        
        // remove the 'Bearer ' part of the token ('Bearer 34jnkdg834')
        token = token.split(' ').pop().trim()
        
        // verify the token
        const { data } = jwt.verify(token, secret)

        // pass the payload from the token to the request object
        req.user = data

        // move onto the route (or next middleware)
        next()
    } catch (err) {

        console.log(err.message)
        res.status(400).json({ message: err.message })
    }
    
}
