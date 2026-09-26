const express = require('express');

const router = express.Router(); 
//skapar router (lista där vi kopplar url:er till funktioner)

const { getQuestions } = require ('../controllers/questionController'); //lånar funktionen

router.get('/', getQuestions);
// kör getQuestions om det kommer en GET

module.exports = router;