const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const path = require('path');

const app = express();

// Increase Node.js memory limit (set early)
if (process.env.NODE_ENV === 'production') {
  process.env.NODE_OPTIONS = '--max-old-space-size=4096';
} else {
  process.env.NODE_OPTIONS = '--max-old-space-size=2048';
}

// Middleware
app.use(cors());
app.use(express.json());

// Serve frontend static files
app.use(express.static(path.join(__dirname, "../client/dist")));

// Import routes after middleware
const moodRoutes = require('./routes/moodRoutes');

// Routes
app.use('/api', moodRoutes);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
});

app.get('/', (req, res) => {
  res.send('Hello from Emoticoin server!');
});

const PORT = process.env.PORT || 3001;

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => console.error(err));
