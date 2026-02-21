// 1. Import necessary packages
const express = require('express');
const cors = require('cors');

// Import your new, separated JSON data files
const page1Data = require('./Laying the Digital Foundations.json');
const page2Data = require('./Democratisation of Connectivity&Digital Inclusion.json');
const page3Data = require('./SmartNationEvolution.json');
const quizData = require('./quiz.json');

// 2. Initialize the Express app
const app = express();

// 3. Define the port the server will run on
const PORT = 3000;

// 4. Use CORS middleware
app.use(cors());

// 5. Create the API endpoints for each page and the quiz
app.get('/api/page1', (req, res) => {
  res.json(page1Data);
});

app.get('/api/page2', (req, res) => {
  res.json(page2Data);
});

app.get('/api/page3', (req, res) => {
  res.json(page3Data);
});

app.get('/api/quiz', (req, res) => {
  res.json(quizData);
});
// 6. Start the server
app.listen(PORT, () => {
  console.log(`API server is running at http://localhost:${PORT}`);
});