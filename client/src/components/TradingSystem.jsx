import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const coinTypes = [
  "HappyCoins",
  "SadCoins",
  "TiredCoins",
  "ExcitedCoins",
  "AngryCoins",
];

const tradeRules = {
  HappyCoins: { SadCoins: 2, TiredCoins: 1.5, ExcitedCoins: 1, AngryCoins: 2 },
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
  ExcitedCoins: { HappyCoins: 1, SadCoins: 2, TiredCoins: 2, AngryCoins: 2 },
  AngryCoins: {
    HappyCoins: 0.5,
    SadCoins: 1,
    TiredCoins: 1,
    ExcitedCoins: 0.5,
  },
};

const coinColors = {
  HappyCoins: "#FFD700",
  SadCoins: "#87CEEB",
  TiredCoins: "#DDA0DD",
  ExcitedCoins: "#FFA500",
  AngryCoins: "#FF6B6B",
};

const TradingSystem = ({
  userCoins = {},
  lastUpdatedCoin,
  lastTradedFrom,
  onTrade,
}) => {
  const [fromCoin, setFromCoin] = useState("");
  const [toCoin, setToCoin] = useState("");
  const [amount, setAmount] = useState(1);

  const getTradeRate = () => {
    if (!fromCoin || !toCoin) return null;
    return tradeRules[fromCoin][toCoin];
  };

  const handleTrade = () => {
    if (!fromCoin || !toCoin || amount <= 0) return;
    if (typeof onTrade === "function") {
      onTrade(fromCoin, toCoin, amount);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glassmorphism"
      style={{
        padding: "30px",
        marginTop: "30px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <h3 style={{ textAlign: "center", marginBottom: "20px" }}>
        Trade Your Coins
      </h3>

      <div
        style={{
          display: "flex",
          gap: "20px",
          justifyContent: "center",
          marginBottom: "20px",
        }}
      >
        <div>
          <label>From:</label>
          <select
            value={fromCoin}
            onChange={(e) => setFromCoin(e.target.value)}
            style={{
              padding: "8px",
              borderRadius: "5px",
              margin: "0 10px",
              background: "rgba(255,255,255,0.1)",
              color: "white",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            <option value="">Select Coin</option>
            {coinTypes.map((coin) => (
              <option key={coin} value={coin}>
                {coin}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>To:</label>
          <select
            value={toCoin}
            onChange={(e) => setToCoin(e.target.value)}
            style={{
              padding: "8px",
              borderRadius: "5px",
              margin: "0 10px",
            }}
          >
            <option value="">Select Coin</option>
            {coinTypes
              .filter((c) => c !== fromCoin)
              .map((coin) => (
                <option key={coin} value={coin}>
                  {coin}
                </option>
              ))}
          </select>
        </div>

        <div>
          <label>Amount:</label>
          <input
            type="number"
            min="1"
            value={amount}
            onChange={(e) => setAmount(parseInt(e.target.value) || 1)}
            style={{
              padding: "8px",
              borderRadius: "5px",
              margin: "0 10px",
              width: "60px",
            }}
          />
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleTrade}
        style={{
          display: "block",
          margin: "0 auto",
          padding: "10px 20px",
          borderRadius: "5px",
          border: "none",
          background: "linear-gradient(135deg, #4CAF50, #45a049)",
          color: "white",
          cursor: "pointer",
          fontSize: "16px",
        }}
        disabled={!fromCoin || !toCoin || amount < 1}
      >
        Trade Coins
      </motion.button>

      {fromCoin && toCoin && (
        <div
          style={{
            marginTop: "20px",
            textAlign: "center",
            padding: "10px",
            background: "rgba(255,255,255,0.1)",
            borderRadius: "5px",
          }}
        >
          <h4 style={{ marginBottom: "10px" }}>Trade Rate</h4>
          <p>
            1 {fromCoin} = {tradeRules[fromCoin][toCoin]} {toCoin}
          </p>
          {amount > 0 && (
            <p>
              You will receive:{" "}
              {Math.floor(amount * tradeRules[fromCoin][toCoin])} {toCoin}
            </p>
          )}
        </div>
      )}

      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <h4>Your Coin Balance:</h4>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "20px",
            flexWrap: "wrap",
          }}
        >
          {coinTypes.map((coin) => {
            const amount = userCoins[coin] || 0;
            const isLast = lastUpdatedCoin === coin;
            const isFrom = lastTradedFrom === coin;
            return (
              <motion.div
                key={coin}
                animate={
                  isLast
                    ? {
                        scale: [1.2, 1],
                        boxShadow: `0 0 20px ${coinColors[coin]}`,
                      }
                    : isFrom
                    ? {
                        scale: [1.1, 1],
                        boxShadow: `0 0 10px ${coinColors[coin]}`,
                      }
                    : { scale: 1, boxShadow: "none" }
                }
                transition={{ duration: 0.6 }}
                style={{
                  padding: "10px",
                  background: "rgba(255,255,255,0.2)",
                  borderRadius: "5px",
                  minWidth: "120px",
                  border:
                    isLast || isFrom ? `2px solid ${coinColors[coin]}` : "none",
                  fontWeight: isLast || isFrom ? "bold" : "normal",
                  color: isLast
                    ? coinColors[coin]
                    : isFrom
                    ? coinColors[coin]
                    : "white",
                }}
              >
                <strong>{coin}:</strong> {amount}
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default TradingSystem;