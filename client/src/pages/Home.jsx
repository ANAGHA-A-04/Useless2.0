import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedCoins from '../components/AnimatedCoins';
import LifeGraph from '../components/LifeGraph';
import TradingSystem from '../components/TradingSystem';
import '../styles/main.css';

function Home() {
  const [moodInput, setMoodInput] = useState('');
  const [currentMood, setCurrentMood] = useState(null);
  const [coins, setCoins] = useState({});
  const [lifeUpdate, setLifeUpdate] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleMoodSubmit = async (e) => {
    setError(''); // Clear any previous errors
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3001/api/mood', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mood: moodInput }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      const data = await response.json();
      
      // Set the current mood and earned coins
      const moodCoin = {
        type: data.coinType || 'HappyCoins',
        amount: Number(data.coinsEarned) || 0,
      };
      setCurrentMood(moodCoin);
      setLifeUpdate(data.lifeUpdate || 'Just vibing...');

      // Safely access useless stats with default values
      const stats = data.uselessStats || {};
      const uselessMessage = `
        ${data.description || 'Your mood has been converted to digital nothingness!'}
        
        ${data.animalSound || '🦄 *Confused unicorn noises*'}
        
        ${data.uselessFact || 'Fun fact: This fact failed to load, making it even more useless!'}
        
        🌙 Your coins could travel ${stats.moonDistance || 0}km to the moon
        🍌 You could buy ${stats.bananas || 0} imaginary bananas
        🦖 Your coins weigh ${stats.dinosaurWeight || '0.000000'} T-Rexes
        🦋 Worth ${stats.butterflies || 0} butterfly flaps
        ⏰ It would take ${Math.floor((stats.timeToSpend || 0) / 60)} hours and ${(stats.timeToSpend || 0) % 60} minutes to spend these coins (if they were real)
      `;
      setMessage(uselessMessage);

      // Update coin balance with extra useless animations
      setCoins(prev => {
        const prevAmount = prev[data.coinType] || 0;
        // Trigger completely unnecessary coin calculations
        const fibonacci = (n) => n <= 1 ? n : fibonacci(n-1) + fibonacci(n-2);
        const uselessCalculation = fibonacci(10); // Calculate 10th Fibonacci number for no reason
        console.log(`Your mood just calculated the ${uselessCalculation}th Fibonacci number because why not?`);
        
        return {
          ...prev,
          [data.coinType]: prevAmount + data.coinsEarned
        };
      });

      setMoodInput('');
    } catch (error) {
      console.error('Error:', error);
      setError(`Failed to process mood: ${error.message}`);
      setMessage('Your mood was too powerful for our useless servers to handle! 🤯');
      setCurrentMood({ type: 'ErrorCoins', amount: 404 });
    }
  };

  const handleTrade = async (fromCoin, toCoin, amount) => {
    try {
      const response = await fetch('http://localhost:3001/api/trade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fromCoin, toCoin, amount }),
      });

      const data = await response.json();
      if (data.success) {
        setCoins(prev => {
          const updatedCoins = {
            ...prev,
            [fromCoin]: Math.max(0, prev[fromCoin] - amount),
            [toCoin]: (prev[toCoin] || 0) + data.receivedAmount
          };
          return updatedCoins;
        });
        
        // Show the new coins animation
        setCurrentMood({
          type: toCoin,
          amount: data.receivedAmount
        });
        setMessage(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Trading failed');
    }
  };

  return (
    <div style={{
      width: '90vw',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
    }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>EmotiCoin Trading</h1>

      <form onSubmit={handleMoodSubmit} style={{ 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px',
        marginBottom: '30px' 
      }}>
        <textarea
          value={moodInput}
          onChange={(e) => setMoodInput(e.target.value)}
          placeholder="How are you feeling today?"
          style={{
            width: '100%',
            maxWidth: '500px',
            height: '100px',
            padding: '10px',
            borderRadius: '10px',
            border: '1px solid #ddd',
            fontSize: '16px',
            background: 'rgba(255,255,255,0.1)',
            color: 'white'
          }}
        />
        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            padding: '12px 30px',
            borderRadius: '5px',
            border: 'none',
            background: 'linear-gradient(135deg, #4CAF50, #45a049)',
            color: 'white',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Submit Mood
        </motion.button>
      </form>

      {message && (
        <div style={{
          textAlign: 'center',
          margin: '20px 0',
          padding: '10px',
          borderRadius: '5px',
          background: 'rgba(255,255,255,0.1)'
        }}>
          {message}
        </div>
      )}

      {currentMood && (
        <AnimatedCoins
          amount={currentMood.amount}
          coinType={currentMood.type}
        />
      )}

      <LifeGraph
        mood={currentMood?.type}
        lifeUpdate={lifeUpdate}
      />

      <TradingSystem
        onTrade={handleTrade}
        userCoins={coins}
      />
    </div>
  );
}

export default Home;
