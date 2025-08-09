const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  coins: {
    HappyCoins: { type: Number, default: 0 },
    SadCoins: { type: Number, default: 0 }
  },
  moodHistory: [
    {
      mood: String,
      description: String,
      coinsEarned: Number,
      date: { type: Date, default: Date.now }
    }
  ]
});

module.exports = mongoose.model('User', userSchema);
