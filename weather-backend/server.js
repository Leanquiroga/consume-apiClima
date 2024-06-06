const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Failed to connect to MongoDB', err);
});

// Weather schema and model
const weatherSchema = new mongoose.Schema({
  city: String,
  country: String,
  temperature: Number,
  condition: String,
  conditionText: String,
  icon: String,
  forecast: Array,
  timestamp: { type: Date, default: Date.now }
});

const Weather = mongoose.model('Weather', weatherSchema);

// Route to save weather data
app.post('/api/weather', async (req, res) => {
  try {
    const weatherData = new Weather(req.body);
    await weatherData.save();
    res.status(201).send(weatherData);
  } catch (err) {
    res.status(500).send({ error: 'Failed to save weather data' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
