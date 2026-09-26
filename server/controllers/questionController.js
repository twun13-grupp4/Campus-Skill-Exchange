const getQuestions = (req, res) => { //funktion som skickar en fråga med frågan, klass, och status
    res.json([{title: 'Kan du diffrentialekvationer?',
         courseTag: 'Envariabelanalys',
          status: 'unanswered'}])
}

module.exports = { getQuestions }; //gör funktonen shareble
