import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedCoins from "../components/AnimatedCoins";
import LifeGraph from "../components/LifeGraph";
import TradingSystem from "../components/TradingSystem";
import "../styles/main.css";

function Home() {
  const [moodInput, setMoodInput] = useState("");
  const [currentMood, setCurrentMood] = useState(null);
  const [coins, setCoins] = useState({});
  const [lifeUpdate, setLifeUpdate] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [lastUpdatedCoin, setLastUpdatedCoin] = useState(null);
  const [lastTradedFrom, setLastTradedFrom] = useState(null);

  const handleMoodSubmit = async (e) => {
    setError("");
    e.preventDefault();

    // fallback mood logic
    const fallbackMoodDetect = (text) => {
      const t = text.toLowerCase();
      if (t.includes("happy") || t.includes("joy") || t.includes("good"))
        return { mood: "HAPPY", coinType: "HappyCoins", coinsEarned: 10 };
      if (t.includes("sad") || t.includes("depress"))
        return { mood: "SAD", coinType: "SadCoins", coinsEarned: 8 };
      if (t.includes("tired") || t.includes("sleep"))
        return { mood: "TIRED", coinType: "TiredCoins", coinsEarned: 6 };
      if (t.includes("excite"))
        return { mood: "EXCITED", coinType: "ExcitedCoins", coinsEarned: 12 };
      if (t.includes("angry") || t.includes("mad"))
        return { mood: "ANGRY", coinType: "AngryCoins", coinsEarned: 7 };
      return { mood: "HAPPY", coinType: "HappyCoins", coinsEarned: 5 };
    };

    try {
      const response = await fetch("http://localhost:5000/api/mood", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mood: moodInput }),
      });

      let data;
      if (!response.ok) {
        // fallback
        data = fallbackMoodDetect(moodInput);
        data.lifeUpdate = "Just vibing...";
        data.description =
          "Your mood has been converted to digital nothingness!";
        data.animalSound = "🦄 Confused unicorn noises";
        data.uselessFact =
          "Fun fact: This fact failed to load, making it even more useless!";
        data.uselessStats = {};
      } else {
        data = await response.json();
      }

      // Set the current mood and earned coins
      const moodCoin = {
        type: data.coinType || "HappyCoins",
        amount: Number(data.coinsEarned) || 0,
      };
      setCurrentMood(moodCoin);
      setLifeUpdate(data.lifeUpdate || "Just vibing...");
      setLastUpdatedCoin(moodCoin.type);

      // Safely access useless stats with default values
      const stats = data.uselessStats || {};
      const uselessMessage = `
        ${
          data.description ||
          "Your mood has been converted to digital nothingness!"
        }
        
        ${data.animalSound || "🦄 Confused unicorn noises"}
        
        ${
          data.uselessFact ||
          "Fun fact: This fact failed to load, making it even more useless!"
        }
        
        🌙 Your coins could travel ${stats.moonDistance || 0}km to the moon
        🍌 You could buy ${stats.bananas || 0} imaginary bananas
        🦖 Your coins weigh ${stats.dinosaurWeight || "0.000000"} T-Rexes
        🦋 Worth ${stats.butterflies || 0} butterfly flaps
        ⏰ It would take ${Math.floor(
          (stats.timeToSpend || 0) / 60
        )} hours and ${
        (stats.timeToSpend || 0) % 60
      } minutes to spend these coins (if they were real)
      `;
      setMessage(uselessMessage);

      setCoins((prev) => {
        const prevAmount = prev[data.coinType] || 0;
        return {
          ...prev,
          [data.coinType]: prevAmount + data.coinsEarned,
        };
      });

      setMoodInput("");
    } catch (error) {
      // fallback
      const data = fallbackMoodDetect(moodInput);
      setCurrentMood({ type: data.coinType, amount: data.coinsEarned });
      setLastUpdatedCoin(data.coinType);
      setCoins((prev) => ({
        ...prev,
        [data.coinType]: (prev[data.coinType] || 0) + data.coinsEarned,
      }));
      setMessage("Your mood has been converted to digital nothingness!");
      setLifeUpdate("Just vibing...");
      setMoodInput("");
    }
  };

  const handleTrade = async (fromCoin, toCoin, amount) => {
    // Check if user has enough coins to trade
    const userFromCoinAmount = coins[fromCoin] || 0;
    if (userFromCoinAmount < amount) {
      setMessage(
        `Not enough ${fromCoin} to trade! You have ${userFromCoinAmount} but need ${amount}.`
      );
      return;
    }

    // Define trade rules locally for fallback
    const tradeRules = {
      HappyCoins: {
        SadCoins: 2,
        TiredCoins: 1.5,
        ExcitedCoins: 1,
        AngryCoins: 2,
      },
      SadCoins: {
        HappyCoins: 0.5,
        TiredCoins: 1,
        ExcitedCoins: 0.5,
        AngryCoins: 1,
      },
      TiredCoins: {
        HappyCoins: 0.75,
        SadCoins: 1,
        ExcitedCoins: 0.5,
        AngryCoins: 1,
      },
      ExcitedCoins: {
        HappyCoins: 1,
        SadCoins: 2,
        TiredCoins: 2,
        AngryCoins: 2,
      },
      AngryCoins: {
        HappyCoins: 0.5,
        SadCoins: 1,
        TiredCoins: 1,
        ExcitedCoins: 0.5,
      },
    };

    const tradeRate = tradeRules[fromCoin][toCoin];
    const receivedAmount = Math.floor(amount * tradeRate);

    try {
      const response = await fetch("http://localhost:5000/api/trade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fromCoin, toCoin, amount }),
      });

      const data = await response.json();
      if (data.success) {
        setCoins((prev) => {
          const updatedCoins = {
            ...prev,
            [fromCoin]: Math.max(0, prev[fromCoin] - amount),
            [toCoin]: (prev[toCoin] || 0) + data.receivedAmount,
          };
          return updatedCoins;
        });
        setCurrentMood({ type: toCoin, amount: data.receivedAmount });
        setLastUpdatedCoin(toCoin);
        setLastTradedFrom(fromCoin);
        setMessage(data.message);
      } else {
        setMessage(data.message || "Trade failed");
      }
    } catch (error) {
      // Fallback: perform trade locally
      setCoins((prev) => {
        const updatedCoins = {
          ...prev,
          [fromCoin]: Math.max(0, prev[fromCoin] - amount),
          [toCoin]: (prev[toCoin] || 0) + receivedAmount,
        };
        return updatedCoins;
      });
      setCurrentMood({ type: toCoin, amount: receivedAmount });
      setLastUpdatedCoin(toCoin);
      setLastTradedFrom(fromCoin);
      setMessage(
  `✅ Successfully traded ${amount} ${fromCoin} for ${receivedAmount} ${toCoin}!`
      );
    }
  };

  return (
    <div
      style={{
        width: "90vw",
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "20px",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "30px" }}>
        EmotiCoin Trading
      </h1>

      <form
        onSubmit={handleMoodSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        <textarea
          value={moodInput}
          onChange={(e) => setMoodInput(e.target.value)}
          placeholder="How are you feeling today?"
          style={{
            width: "100%",
            maxWidth: "500px",
            height: "100px",
            padding: "10px",
            borderRadius: "10px",
            border: "1px solid #ddd",
            fontSize: "16px",
            background: "rgba(255,255,255,0.1)",
            color: "white",
          }}
        />
        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            padding: "12px 30px",
            borderRadius: "5px",
            border: "none",
            background: "linear-gradient(135deg, #4CAF50, #45a049)",
            color: "white",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Submit Mood
        </motion.button>
      </form>

      {message && (
        <div
          style={{
            textAlign: "center",
            margin: "20px 0",
            padding: "10px",
            borderRadius: "5px",
            background: "rgba(255,255,255,0.1)",
          }}
        >
          {message}
        </div>
      )}

      {currentMood && (
        <AnimatedCoins
          amount={currentMood.amount}
          coinType={currentMood.type}
        />
      )}

      <LifeGraph mood={currentMood?.type} lifeUpdate={lifeUpdate} />

      <TradingSystem
        onTrade={handleTrade}
        userCoins={coins}
        lastUpdatedCoin={lastUpdatedCoin}
        lastTradedFrom={lastTradedFrom}
      />
    </div>
  );
}

export default Home;