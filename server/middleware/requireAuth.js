const jwt = require('jsonwebtoken') //kolla tokens
const User = require('../models/User') //hämta inloggade användare

/**
 * Middleware som bara släpper igenom anrop med en giltig JWT
 * den inloggade användaren sparas i req.user så controllern kan använda den
 */
const requireAuth = async(req, res, next) => {
    try {
        const header = req.headers.authorization || ''
        const [type, token] = header.split(' ') //delar upp beared och själva token

        if(type !== 'Bearer' || !token) {
            return res.status(401).json({message: 'Not logged in'}) //ingen token skickad
        }

        //kolla signatur + utgångsdatum, kastar fel om något är fel
        const payload = jwt.verify(token, process.env.JWT_SECRET)

        //kolla om finns i database
        const user = await User.findById(payload.id)
        if(!user) {
            return res.status(401).json({message: 'Not logged in'})
        }
        
        req.user = user //spara användare till nästa funktion
        next()//allt ok
    } catch(error) {
        //fel eller fake token
        if(error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({message: 'Not logged in'})
        }
        console.error(error)
        res.status(500).json({message: 'Could not check login'})
    }
}

module.exports = requireAuth