const express = require('express');
const router = express.Router();
const { getMoodReward, tradeMoodCoins } = require('../controllers/mood');

// Route for getting mood rewards
router.post('/mood', getMoodReward);

// Route for trading coins
router.post('/trade', tradeMoodCoins);

module.exports = router;
