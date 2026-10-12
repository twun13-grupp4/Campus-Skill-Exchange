const mongoose = require('mongoose') //kolla om id är giltigt
const Answer = require ('../models/Answer') //hämtar svar-modellen
require('../models/User') // registrerar User-modellen så populate('author') funkar


/**
 * GET /api/questions/:id/answers
 * hämtar alla svar till en fråga, flest upvots först 
 */

const getAnswersByQuestion = async (req, res) => {
    try {
        const {id} = req.params //frågans id

        //ogiltigt id format
        if(!mongoose.isValidObjectId(id)) {
            return res.status(404).json({message: 'Question not found'})
        }

        const answers = await Answer.find({question: id}) //alla svar som hör till frågan
            .populate('author', 'name') //namn istället för id
            .sort({upvotes: -1, createdAt: 1 }) //flest upvotes, sen äldst först

        res.json(answers) //skicka listan       
    }   catch(error) {
        console.error(error)
        res.status(500).json({message: 'Could not fetch answers'})
    }
}

module.exports = {getAnswersByQuestion}