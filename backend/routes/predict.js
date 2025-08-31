const express = require('express');
const axios = require('axios');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const inputData = req.body; // Array of input feature objects
    const flaskURL = 'http://127.0.0.1:5000/predict'; // Flask default port is 5000

    // Post data to Flask server for prediction
    const response = await axios.post(flaskURL, inputData);

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Prediction failed', details: error.message });
  }
});

module.exports = router;