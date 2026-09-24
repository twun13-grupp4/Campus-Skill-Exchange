const express = require('express');
const cors = require('cors'); 

const app = express(); //starta serverappen 
app.use(cors());
app.use(express.json()); // appen tolkar JSON

const questionsRoutes = require('./routes/questionRoutes'); //hämtar routerfilen (mockfråga)
app.use('/api/questions', questionsRoutes) //(path, funktion) för test curl http://localhost:3000/api/questions

const PORT = 3000; //http://localhost:3000
app.listen(PORT, () => console.log(`Server running on port ${PORT} `));