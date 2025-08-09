import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const sillyLifeEvents = [
  "Found a rubber duck army",
  "Cloud looked like a pizza",
  "Plant said thanks for water",
  "Sock disappeared mysteriously",
  "Made friends with a squirrel",
  "High-fived reflection",
  "Banana perfectly peeled",
  "Chair made funny noise",
  "Found glitter in pocket",
  "Shadow did cool dance"
];

export default function LifeGraph({ mood, lifeUpdate }) {
  const [currentMoodState, setCurrentMoodState] = useState(mood);
  const [dataPoints, setDataPoints] = useState([]);
  const [wavePoints, setWavePoints] = useState([]);
  const maxPoints = 20;

  useEffect(() => {
    const interval = setInterval(() => {
      setWavePoints(prev => {
        const amplitude = currentMoodState?.type === 'SadCoins' ? 5 : 15; // Lower amplitude for sad mood
        const frequency = currentMoodState?.type === 'ExcitedCoins' ? 2 : 1; // Faster waves for excited mood
        const baseHeight = currentMoodState?.type === 'SadCoins' ? 30 : 50; // Lower baseline for sad mood
        const time = Date.now() / 1000;
        const newValue = Math.sin(time * frequency) * amplitude + baseHeight;
        const newPoints = [...prev];
        newPoints.push(newValue);
        return newPoints.slice(-100);
      });
    }, 50);

    return () => clearInterval(interval);
  }, [currentMoodState]);

  useEffect(() => {
    setCurrentMoodState(mood);
    if (mood && lifeUpdate) {
      setDataPoints(prev => {
        const newPoints = [...prev, {
          mood,
          value: getMoodValue(mood),
          update: lifeUpdate,
          timestamp: new Date().toLocaleTimeString()
        }];
        
        // Update wave amplitude based on mood value
        const moodValue = getMoodValue(mood);
        const amplitude = moodValue / 2;
        setWavePoints(prev => {
          const phase = Date.now() / 1000;
          return Array(100).fill(0).map((_, i) => 
            Math.sin(phase + i / 10) * amplitude + moodValue
          );
        });
        
        return newPoints.slice(-maxPoints);
      });
    }
  }, [mood, lifeUpdate]);

  const getMoodValue = (mood) => {
    const values = {
      HAPPY: 80,
      EXCITED: 100,
      TIRED: 40,
      SAD: 20,
      ANGRY: 30
    };
    return values[mood] || 50;
  };

  return (
    <div style={{ 
      width: '90vw',
      maxWidth: '1200px',
      height: '400px',
      padding: '25px',
      background: 'rgba(255,255,255,0.05)',
      backdropFilter: 'blur(10px)',
      borderRadius: '20px',
      marginTop: '30px',
      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      border: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h3>Your Emotional Journey</h3>
        <p style={{ 
          fontSize: '0.9rem', 
          color: 'rgba(255,255,255,0.8)', 
          maxWidth: '600px', 
          margin: '10px auto',
          padding: '10px',
          background: 'rgba(255,51,51,0.1)',
          borderRadius: '8px',
          boxShadow: '0 0 10px rgba(255,51,51,0.2)'
        }}>
          {currentMoodState?.type === 'SadCoins' 
            ? "Remember: Every dip in the graph is temporary! Just like waves in the ocean, your emotions naturally flow up and down. Better moments are just around the corner! 🌅" 
            : "Watch your emotional waves dance through time! Each peak represents a moment of strength, and even the valleys are opportunities for growth. Keep riding those waves! 🌊"}
        </p>
      </div>
      <div className="graph-grid" style={{
        position: 'relative',
        height: '250px',
        marginTop: '20px',
        padding: '20px 40px',
        borderLeft: '3px solid #FF3333',
        borderBottom: '3px solid #FF3333',
        background: 'rgba(255, 51, 51, 0.05)'
      }}>
        {/* Time markers */}
        <div style={{
          position: 'absolute',
          bottom: '-30px',
          left: '0',
          right: '0',
          display: 'flex',
          justifyContent: 'space-between',
          padding: '0 40px'
        }}>
          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem' }}>30s ago</span>
          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem' }}>now</span>
        </div>
        
        {/* Mood level indicators */}
        <div style={{
          position: 'absolute',
          top: '50%',
          right: '10px',
          transform: 'translateY(-50%)',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          background: 'rgba(255,51,51,0.1)',
          padding: '10px',
          borderRadius: '8px'
        }}>
          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem' }}>High Energy</span>
          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem' }}>Neutral</span>
          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem' }}>Low Energy</span>
        </div>

        {/* Y-axis labels */}
        <div style={{
          position: 'absolute',
          left: '-40px',
          top: 0,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          color: 'rgba(255,255,255,0.6)',
          fontSize: '12px'
        }}>
          <span>Super Epic</span>
          <span>Pretty Good</span>
          <span>Meh</span>
          <span>Not Great</span>
          <span>Need Hugs</span>
        </div>

        {/* X-axis grid lines */}
        {[...Array(5)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            left: '40px',
            right: 0,
            top: `${i * 25}%`,
            borderTop: '2px dashed #4169E1'
          }} />
        ))}

        <div style={{ 
          position: 'relative',
          height: '100%',
          zIndex: 1
        }}>
          <svg
            style={{
              width: '100%',
              height: '100%',
              position: 'absolute',
              top: 0,
              left: 0
            }}
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="waveGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={mood ? getMoodColor(mood) : '#4169E1'} stopOpacity="0.2" />
                <stop offset="100%" stopColor={mood ? getMoodColor(mood) : '#4169E1'} stopOpacity="0.8" />
              </linearGradient>
            </defs>
            <path
              d={`M 0,${Math.max(0, Math.min(100, 100 - (wavePoints[0] || 50)))} ${wavePoints.map((point, i) => {
                const x = (i / (wavePoints.length - 1)) * 100;
                const y = Math.max(0, Math.min(100, 100 - point));
                return Number.isFinite(x) && Number.isFinite(y) ? `L ${x},${y}` : '';
              }).join(' ')}`}
              fill="none"
              stroke={currentMoodState?.type === 'SadCoins' ? '#FF6666' : '#FF3333'}
              strokeWidth="5"
              style={{
                filter: `drop-shadow(0 0 8px ${currentMoodState?.type === 'SadCoins' ? '#FF6666' : '#FF3333'})`
              }}
            />
          </svg>
          {dataPoints.map((point, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileHover={{
                scale: 1.5,
                boxShadow: `0 0 20px ${getMoodColor(point.mood)}`,
                zIndex: 10
              }}
              onHoverStart={() => {
                const tooltip = document.createElement('div');
                tooltip.className = 'mood-tooltip';
                tooltip.style.position = 'absolute';
                tooltip.style.background = 'rgba(0,0,0,0.8)';
                tooltip.style.color = '#fff';
                tooltip.style.padding = '8px 12px';
                tooltip.style.borderRadius = '6px';
                tooltip.style.fontSize = '0.8rem';
                tooltip.style.zIndex = '1000';
                tooltip.style.whiteSpace = 'nowrap';
                tooltip.innerHTML = `
                  ${point.mood} at ${point.timestamp}<br/>
                  "${point.update}"<br/>
                  💰 Earned ${point.coinAmount || 'some'} coins
                `;
                document.body.appendChild(tooltip);
                const rect = event.target.getBoundingClientRect();
                tooltip.style.top = `${rect.top - tooltip.offsetHeight - 10}px`;
                tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;
              }}
              onHoverEnd={() => {
                const tooltip = document.querySelector('.mood-tooltip');
                if (tooltip) tooltip.remove();
              }}
              style={{
                position: 'absolute',
                bottom: `${point.value}%`,
                left: `${(index / maxPoints) * 100}%`,
                transform: 'translate(-50%, 50%)',
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: getMoodColor(point.mood),
                boxShadow: `0 0 10px ${getMoodColor(point.mood)}`,
                cursor: 'pointer',
                zIndex: 2
              }}
              onMouseEnter={() => {
                const tooltip = document.createElement('div');
                tooltip.className = 'mood-tooltip';
                tooltip.innerHTML = `${point.update}<br/>${point.timestamp}`;
                document.body.appendChild(tooltip);
              }}
              onMouseMove={(e) => {
                const tooltip = document.querySelector('.mood-tooltip');
                if (tooltip) {
                  tooltip.style.left = e.pageX + 10 + 'px';
                  tooltip.style.top = e.pageY + 10 + 'px';
                }
              }}
              onMouseLeave={() => {
                const tooltip = document.querySelector('.mood-tooltip');
                if (tooltip) {
                  document.body.removeChild(tooltip);
                }
              }}
          >
            <div style={{
              position: 'absolute',
              bottom: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(0,0,0,0.8)',
              padding: '5px',
              borderRadius: '5px',
              fontSize: '12px',
              whiteSpace: 'nowrap',
              opacity: 0,
              transition: '0.3s opacity',
              pointerEvents: 'none'
            }}>
              {point.update}<br/>
              {point.timestamp}
            </div>
          </motion.div>
        ))}
      </div>
      </div>
    </div>
  );
}

function getMoodColor(mood) {
  const colors = {
    HAPPY: '#FF3333',     // Bright red for happy
    SAD: '#FF6666',       // Lighter red for sad
    TIRED: '#FF4444',     // Medium red for tired
    EXCITED: '#FF1111',   // Intense red for excited
    ANGRY: '#FF2222'      // Strong red for angry
  };
  return colors[mood] || '#FF3333';
}
