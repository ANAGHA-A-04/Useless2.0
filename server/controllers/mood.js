const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);

const moodTypes = {
  HAPPY: "HappyCoins",
  SAD: "SadCoins",
  TIRED: "TiredCoins",
  EXCITED: "ExcitedCoins",
  ANGRY: "AngryCoins",
};

const coinValues = {
  HappyCoins: 10,
  SadCoins: 8,
  TiredCoins: 6,
  ExcitedCoins: 12,
  AngryCoins: 7,
};

exports.getMoodReward = async (req, res) => {
  const { mood } = req.body;
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  const prompt = `Analyze this text and categorize the emotion as one of these: HAPPY, SAD, TIRED, EXCITED, ANGRY. If the text indicates sadness or depression, categorize it as SAD. Text: "${mood}"`;

  try {
    const result = await model.generateContent(prompt);
    const detectedMood = await result.response.text();
    const normalizedMood = detectedMood.trim().toUpperCase();
    const coinType = moodTypes[normalizedMood] || moodTypes.HAPPY;
    
    // Calculate coins based on mood type
    const baseCoins = coinValues[coinType] || 5;
    const randomFactor = Math.random() * 0.4 + 0.8; // Random factor between 0.8 and 1.2
    const coinsEarned = Math.floor(baseCoins * randomFactor);

    // Generate sassy descriptions based on mood
    const animalSounds = {
      HAPPY: ["🐶 *Wags tail in Bitcoin*", "🐘 *Financial trumpet noises*", "🦒 *Stretches neck to check portfolio*"],
      SAD: ["🐢 *Slowly withdraws into shell with savings*", "🦉 *Wise but broke hooting*", "🐌 *Economic slowdown noises*"],
      TIRED: ["🦥 *Sleeping through market crashes*", "🐨 *Eucalyptus budget planning*", "🐻 *Bearish market hibernation*"],
      EXCITED: ["🦘 *Bouncing cryptocurrency kangaroo*", "🐒 *NFT monkey business*", "🦅 *Soaring investment screech*"],
      ANGRY: ["🦁 *Roars at empty wallet*", "🐺 *Howls at blockchain*", "🦈 *Aggressive trading noises*"]
    };

    const randomFacts = {
      HAPPY: ["Did you know? Your smile uses fewer muscles than your frown, saving valuable energy for mining coins!"],
      SAD: ["Fun fact: Penguins propose with pebbles. Your SadCoins are basically digital pebbles!"],
      TIRED: ["Science says: Your yawn can power exactly 0 blockchain transactions!"],
      EXCITED: ["Fact: If you jumped for every coin you earned, you'd reach the moon in approximately never!"],
      ANGRY: ["Hot take: Your current body temperature could warm up exactly 0 cold wallets!"]
    };

    const sassyDescriptions = {
      HAPPY: ["Converting your happiness into completely worthless digital currency! 💃", "Congratulations! Your joy has been monetized into meaningless tokens! ✨", "Your smile is now a blockchain transaction! 🎉"],
      SAD: ["Here's some sad coins that are literally worth less than your tears! 💔", "Your melancholy has been transformed into worthless digital assets! 🫂", "Depression? Here's some pixels that pretend to be money! 👑"],
      TIRED: ["Your exhaustion has been mined into pointless digital currency! ☕", "Too tired to care? Perfect time to earn fake money! 😴", "Your fatigue is now a digital asset! Much help, very wow! 💤"],
      EXCITED: ["Your excitement has been converted into meaningless numbers! ⚡", "All that energy just created some worthless digital coins! 🌟", "Congrats! Your enthusiasm is now a useless digital asset! 🎪"],
      ANGRY: ["Your rage has been monetized into absolutely worthless tokens! 💅", "Anger = Spicy useless coins! 🌶️", "Your fury just minted some meaningless digital currency! 🔥"]
    };

    const descriptions = sassyDescriptions[normalizedMood] || sassyDescriptions.HAPPY;
    const randomDescription = descriptions[Math.floor(Math.random() * descriptions.length)];
    
    // Calculate completely useless statistics
    const safeCoins = Number(coinsEarned) || 0;
    const uselessStats = {
      moonDistance: Math.floor(safeCoins * 384400 / 1000000), // Distance to moon in km
      bananas: Math.floor(safeCoins * 7), // Number of bananas you could buy if these were real coins
      dinosaurWeight: (safeCoins * 0.000001).toFixed(6), // Weight in T-Rex units
      butterflies: Math.floor(safeCoins * 127), // Number of butterfly wing flaps
      timeToSpend: Math.floor(safeCoins * 24 * 60) // Time in minutes it would take to spend these coins if they were real
    };

    const animalSound = animalSounds[normalizedMood][Math.floor(Math.random() * animalSounds[normalizedMood].length)];
    const uselessFact = randomFacts[normalizedMood][0];
    const description = sassyDescriptions[normalizedMood][Math.floor(Math.random() * sassyDescriptions[normalizedMood].length)];

    res.json({
      mood: normalizedMood,
      coinsEarned,
      coinType,
      description,
      animalSound,
      uselessFact,
      uselessStats,
      lifeUpdate: generateRandomLifeUpdate(normalizedMood),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI mood prediction failed" });
  }
};

exports.tradeMoodCoins = async (req, res) => {
  const { fromCoin, toCoin, amount } = req.body;
  
  try {
    const fromValue = coinValues[fromCoin];
    const toValue = coinValues[toCoin];
    const exchangeRate = toValue / fromValue;
    const receivedAmount = Math.floor(amount * exchangeRate);
    
    res.json({
      success: true,
      fromCoin,
      toCoin,
      givenAmount: amount,
      receivedAmount,
      message: `Successfully traded ${amount} ${fromCoin} for ${receivedAmount} ${toCoin}!`
    });
  } catch (err) {
    res.status(500).json({ error: "Trading failed" });
  }
};

function generateRandomLifeUpdate(mood) {
  const updates = {
    HAPPY: [
      "Found a lucky penny!",
      "Someone smiled at you!",
      "The sun is extra bright today!"
    ],
    SAD: [
      "Your plant looked sad but will be fine",
      "Dropped an ice cream cone",
      "Stepped in a puddle"
    ],
    TIRED: [
      "Your pillow is extra fluffy today",
      "Coffee machine broke",
      "Missed your afternoon nap"
    ],
    EXCITED: [
      "Won a small lottery!",
      "Found money in old jeans!",
      "Got a surprise call!"
    ],
    ANGRY: [
      "Stubbed toe but survived",
      "Traffic was bad but you made it",
      "Printer jammed but fixed it"
    ]
  };
  
  const moodUpdates = updates[mood] || updates.HAPPY;
  return moodUpdates[Math.floor(Math.random() * moodUpdates.length)];
}
