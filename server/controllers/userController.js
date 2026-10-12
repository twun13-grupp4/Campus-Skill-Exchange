const jwt = require('jsonwebtoken') //skapar och kollar tokens
const User = require('../models/User') //hämta anävndat-modellen 

/**
 * skapar en JWT-token med använderns id, giltig i 7 dagar 
 */
const createToken = (userId) =>
    jwt.sign({id: userId}, process.env.JWT_SECRET, {expiresIn: '7d'})

/**
 * Plockar ut de fält som är ok att skicka till klienten(ej lösenord)
 */
const toPublicUser = (user) => ({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    school: user.school,
    program: user.program,
})

/**
 * POST /api/users/register
 * skapar nytt konto och loggar in direkt (skickar tillbaka en token)
 */
const registerUser = async (req,res) => {
    try {
        //bara de fält vi tillåterr, INTE role
        const {name, email, password, school, program} = req.body

        //skapa användaren, lösenordet hashas i User.js
        const user = await User.create({name, email, password, school, program })

        res.status(201).json({token: createToken(user._id), user: toPublicUser(user)})
    }   catch(error) {
        //11000 = mongodb för dublett
        if(error.code === 11000) {
            return res.status(409).json({message: 'Email is already registered'}) //409 = krock
    
        }
        //fält saknas 
        if(error.name === 'ValidationError') {
            return res.status(400).json({message: error.message})
        }
        console.error(error)
        res.status(500).json({message: 'Could not register user'})
    }
}


/**
 * POST /api/users/login
 * Loggar in med email och lösenord, skickar tillbaka en token 
 */
const loginUser = async(req,res) => {
    try {
        const{email, password} = req.body

        //båda måste finnas och vara text
        if(typeof email !== 'string' || typeof password !== 'string') {
            return res.status(400).json({message: 'Email and password are required'})
        }

        //leta upp användaren +password behövs efterrsom lösenordet är select: false i User.js
        const user = await User.findOne({email: email.toLowerCase()}).select('+password')

        //samma svar oavsett om är email eller lösenord som är fel
        if(!user || !(await user.comparePassword(password))) {
            return res.status(401).json({message: 'Wrong email or password'}) //401 = inte inloggad
        }

        res.json({token: createToken(user._id), user: toPublicUser(user)})
    }   catch(error) {
        console.error(error)
        res.status(500).json({message: 'Could not log in'})
    }
}

module.exports = {registerUser, loginUser}