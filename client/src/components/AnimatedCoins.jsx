import { motion, AnimatePresence } from "framer-motion";

const coinEmojis = {
  HappyCoins: "😊",
  SadCoins: "😢",
  TiredCoins: "😴",
  ExcitedCoins: "🤩",
  AngryCoins: "😠"
};

const coinColors = {
  HappyCoins: "#FFD700",
  SadCoins: "#87CEEB",
  TiredCoins: "#DDA0DD",
  ExcitedCoins: "#FFA500",
  AngryCoins: "#FF6B6B"
};

export default function AnimatedCoins({ amount = 0, coinType = 'HappyCoins' }) {
  // Ensure amount is a valid number
  const validAmount = Math.max(0, Number(amount) || 0);
  const stackHeight = Math.min(5, validAmount); // Show max 5 coins in a stack
  const stacks = Math.ceil(validAmount / 5);

  return (
    <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginTop: "20px" }}>
      <AnimatePresence>
        {[...Array(stacks)].map((_, stackIndex) => (
          <div
            key={`stack-${stackIndex}`}
            style={{
              display: "flex",
              flexDirection: "column-reverse",
              gap: "2px",
              position: "relative"
            }}
          >
            {[...Array(Math.min(5, amount - stackIndex * 5))].map((_, i) => (
              <motion.div
                key={`coin-${stackIndex}-${i}`}
                initial={{ y: -100, opacity: 0, scale: 0, rotate: -180 }}
                animate={{ 
                  y: 0,
                  opacity: 1,
                  scale: 1,
                  rotate: 0,
                  translateY: i * -10
                }}
                transition={{
                  delay: (stackIndex * 5 + i) * 0.1,
                  type: "spring",
                  stiffness: 200,
                  damping: 15
                }}
                whileHover={{
                  scale: 1.2,
                  rotate: 360,
                  transition: { duration: 0.3 }
                }}
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${coinColors[coinType]}, ${coinColors[coinType]}88)`,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: "1.5rem",
                  position: "absolute",
                  bottom: 0,
                  boxShadow: "0px 4px 8px rgba(0,0,0,0.3)",
                  border: "2px solid rgba(255,255,255,0.5)",
                  zIndex: i
                }}
              >
                {coinEmojis[coinType]}
              </motion.div>
            ))}
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}
