import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const NLP_API_URL = process.env.NLP_API_URL || "http://localhost:5000/process-query";
const WEATHER_API_KEY = process.env.WEATHER_API_KEY || "your_weatherapi_key";
const NEWS_API_KEY = process.env.NEWS_API_KEY || "your_newsapi_key"; // Store API key in .env

app.get("/api/data", async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: "Missing 'query' parameter" });
  }

  console.log(`🔹 Received query: ${query}`);

  try {
    // Step 1: Extract City Name using NLP Service
    const nlpResponse = await axios.post(NLP_API_URL, { query });
    console.log("🔹 NLP Response:", nlpResponse.data);

    const city = nlpResponse.data.city || "Delhi"; // Default city if NLP fails
    console.log(`🔹 Extracted City: ${city}`);

    // Step 2: Fetch Weather Data
    const weatherAPIURL = `https://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${city}`;
    const weatherResponse = await axios.get(weatherAPIURL);
    console.log("✅ Weather API Response:", weatherResponse.data);

    // Step 3: Fetch News Data
    const newsAPIURL = `https://newsdata.io/api/1/news?country=in&q=${city}&apikey=${NEWS_API_KEY}`;
    const newsResponse = await axios.get(newsAPIURL);
    console.log("✅ News API Response:", newsResponse.data.results.slice(0, 5)); // Log top 5 results

    // Step 4: Send Combined Response
    res.json({
      city,
      weather: weatherResponse.data,
      news: newsResponse.data.results.slice(0, 5) // Limit to top 5 news articles
    });

  } catch (error) {
    console.error("❌ API Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`✅ Backend running on port ${PORT}`));
