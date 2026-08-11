import React from 'react';
import { motion } from 'framer-motion';

export default function GameBoard({ teams, levelsCount }) {
  const levels = Array.from({ length: levelsCount }, (_, i) => i + 1);

  return (
    <div className="game-board">
      <div className="steps-container">
        {levels.map(level => {
          const teamsOnLevel = teams.filter(t => t.level === level);
          return (
            <div 
              key={level} 
              className={`step ${teamsOnLevel.length > 0 ? 'active' : ''}`}
              style={{ marginRight: `${(level - 1) * 25}px` }}
            >
              <div className="step-label">مستوى {level}</div>
              <div className="team-avatars">
                {teamsOnLevel.map(t => (
                  <motion.div 
                    key={t.id} 
                    className="team-avatar" 
                    data-team={t.id}
                    layoutId={`team-${t.id}`}
                  >
                    T{t.id + 1}
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="ladder-top" style={{ marginTop: '2rem', marginRight: `${(levelsCount - 1) * 25}px` }}>
        <img src="/download.jpeg" alt="قمة النصر" style={{width: '200px', borderRadius: '10px', boxShadow: '0 0 20px var(--gold)'}} />
        <h2 style={{color: 'var(--gold)', marginTop: '1rem'}}>قمة النصر</h2>
      </div>
    </div>
  );
}
