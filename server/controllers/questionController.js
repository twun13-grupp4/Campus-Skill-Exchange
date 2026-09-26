const getQuestions = (req, res) => { //funktion som skickar en fråga med frågan, klass, och status
    res.json([{title: 'Kan du diffrentialekvationer?',
         courseTag: 'Envariabelanalys',
          status: 'unanswered'}])
}

const createQuestion = (req, res) => { 
    const newQuestion = req.body;
    console.log(newQuestion);
    res.status(201).json(newQuestion); //201 = skickar tillbaka datan som confirmation
}

module.exports = { getQuestions, createQuestion }; //gör funktonen shareble
