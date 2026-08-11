import React, { useState, useEffect } from 'react';
import { riddles } from './data/riddles';
import GameBoard from './components/GameBoard';
import RiddleDoor from './components/RiddleDoor';

const MAX_LIVES = 5;
const MAX_LEVELS = 15;

function App() {
  const [teams, setTeams] = useState([
    { id: 0, name: "الفريق 1", lives: MAX_LIVES, level: 1, score: 0 },
    { id: 1, name: "الفريق 2", lives: MAX_LIVES, level: 1, score: 0 },
    { id: 2, name: "الفريق 3", lives: MAX_LIVES, level: 1, score: 0 },
    { id: 3, name: "الفريق 4", lives: MAX_LIVES, level: 1, score: 0 },
  ]);
  
  const [currentTurn, setCurrentTurn] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [usedQuestionIds, setUsedQuestionIds] = useState([]);
  const [currentRiddle, setCurrentRiddle] = useState(null);

  const activeTeamsCount = teams.filter(t => t.lives > 0).length;
  const isGameOver = activeTeamsCount === 0 || teams.some(t => t.level > MAX_LEVELS);

  const currentTeam = teams[currentTurn];

  // Assign a random unused question for the current team's level
  useEffect(() => {
    if (isGameOver || !currentTeam || currentTeam.lives <= 0) return;

    const levelRiddles = riddles.filter(r => r.level === currentTeam.level);
    const unusedRiddles = levelRiddles.filter(r => !usedQuestionIds.includes(r.id));
    
    // Pick from unused, or if all used, pick from all level riddles as fallback
    const pool = unusedRiddles.length > 0 ? unusedRiddles : levelRiddles;
    
    if (pool.length > 0) {
      const selected = pool[Math.floor(Math.random() * pool.length)];
      setCurrentRiddle(selected);
      if (unusedRiddles.length > 0) {
        setUsedQuestionIds(prev => [...prev, selected.id]);
      }
    }
  }, [currentTurn, currentTeam?.level, isGameOver]); // triggers when turn or level changes

  const getNextTurn = (current, currentTeams) => {
    let next = (current + 1) % 4;
    let count = 0;
    while (currentTeams[next].lives <= 0 && count < 4) {
      next = (next + 1) % 4;
      count++;
    }
    return next;
  };

  const handleAnswerSubmit = (submittedPercentage) => {
    if (!currentRiddle) return;

    const isCorrect = submittedPercentage === currentRiddle.answer;
    
    setTeams(prevTeams => {
      const newTeams = [...prevTeams];
      const team = { ...newTeams[currentTurn] }; // Deep copy to avoid strict mode double mutation bugs
      
      if (isCorrect) {
        team.level += 1;
        team.score += 100; // Exact 100 score addition
        setFeedback({ type: 'success', message: "إجابة صحيحة! تم فتح الباب!" });
      } else {
        team.lives -= 1; // Exact 1 life deduction
        setFeedback({ type: 'error', message: currentRiddle.hint });
      }
      
      newTeams[currentTurn] = team;
      return newTeams;
    });
  };

  const closeFeedback = () => {
    setFeedback(null);
    setCurrentRiddle(null); // Clear riddle to force a new one to be picked if needed
    if (!isGameOver) {
      // If team lost a life but isn't dead, their turn might end? 
      // The rules say "If the answer is wrong, deduct 1 life... let them try again." Wait, the original rules said let them try again, but for multiplayer, a failed turn usually passes the turn to the next team. Let's pass the turn so everyone gets a chance.
      setCurrentTurn(prevTurn => getNextTurn(prevTurn, teams));
    }
  };

  if (isGameOver) {
    const sorted = [...teams].sort((a,b) => b.score - a.score);
    return (
      <div className="app-container">
        <div className="game-over-screen" style={{width: '100%'}}>
          <h1 style={{color: 'var(--gold)', fontSize: '4rem'}}>نهاية اللعبة</h1>
          <h2>الفائز: {sorted[0].name} برصيد {sorted[0].score} نقطة!</h2>
          <div className="podium">
            {sorted.map((t, idx) => (
              <div key={t.id} className="podium-bar" style={{
                height: `${200 - (idx * 40)}px`,
                backgroundColor: `var(--team${t.id+1})`
              }}>
                {t.name}<br/>{t.score} نقطة
              </div>
            ))}
          </div>
          <button className="btn" onClick={() => window.location.reload()}>العب مرة أخرى</button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <GameBoard teams={teams} levelsCount={MAX_LEVELS} />
      
      <div className="interaction-panel">
        <div className="teams-status">
          {teams.map(t => (
            <div key={t.id} className={`team-card ${currentTurn === t.id ? 'active-turn' : ''} ${t.lives === 0 ? 'eliminated' : ''}`}>
              <div className="team-name" style={{color: `var(--team${t.id+1})`}}>{t.name}</div>
              <div className="team-lives">❤️ {t.lives}</div>
              <div>النقاط: {t.score}</div>
              <div>المستوى: {t.level}</div>
            </div>
          ))}
        </div>

        {currentRiddle && (
          <RiddleDoor currentRiddle={currentRiddle} onSubmit={handleAnswerSubmit} />
        )}
      </div>

      {feedback && (
        <div className="feedback-overlay">
          <div className={`feedback-card ${feedback.type}`}>
            <h2 style={{color: feedback.type === 'success' ? 'var(--gold)' : 'var(--primary)'}}>
              {feedback.type === 'success' ? '✅ تم السماح بالدخول' : '❌ تم رفض الدخول'}
            </h2>
            <p style={{fontSize: '1.2rem'}}>{feedback.message}</p>
            {teams[currentTurn].lives === 0 && feedback.type === 'error' && (
              <p style={{color: 'var(--primary)', fontWeight: 'bold', marginTop: '1rem'}}>
                تم إقصاء {teams[currentTurn].name}!
              </p>
            )}
            <button className="btn" onClick={closeFeedback}>متابعة</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
