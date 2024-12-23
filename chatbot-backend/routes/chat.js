const express = require('express');
const router = express.Router();
const Query = require('../models/query');
const OpenAI = require('openai');
require('dotenv').config();

// Initialize the OpenAI API client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// POST route to handle medical queries
router.post('/', async (req, res) => {
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ reply: 'Please provide a valid query.' });
  }

  try {
    // Check if the query already exists in the database
    const existingQuery = await Query.findOne({ query });
    if (existingQuery) {
      return res.json({ reply: existingQuery.response });
    }

    // Use OpenAI API to get a response for medical queries
    const aiResponse = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',  // Use the latest model like 'gpt-4' if available
      messages: [
        { role: 'system', content: 'You are a medical assistant. Provide answers to medical queries related to symptoms, treatment, medications, and general health advice.' },
        { role: 'user', content: query },
      ],
      max_tokens: 150,
      temperature: 0.7,
    });

    const responseText = aiResponse.choices[0].message.content.trim();

    // Save the query and response in the database for future reference
    const newQuery = new Query({
      query,
      response: responseText,
    });

    await newQuery.save();

    // Send the AI-generated medical response
    res.json({ reply: responseText });
  } catch (error) {
    console.error('Error during AI processing:', error);
    res.status(500).json({ reply: 'Error processing the query. Please try again later.' });
  }
});

module.exports = router;
