import React, { useState } from 'react';

export default function RiddleDoor({ currentRiddle, onSubmit }) {
  const [sliderValue, setSliderValue] = useState(0);

  return (
    <div className="riddle-container">
      <div className="riddle-topic">{currentRiddle.topic} - مستوى {currentRiddle.level}</div>
      <div className="riddle-text">{currentRiddle.riddle}</div>
      
      <div className="door-container">
        <div className="wood-door">
          <div className="door-fill" style={{ height: `${sliderValue}%` }}></div>
          
          <div className="door-window"></div>
          
          <div 
            className="door-handle" 
            onClick={() => onSubmit(sliderValue)}
            title="انقر لتأكيد الإجابة"
          ></div>
          
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={sliderValue} 
            onChange={(e) => setSliderValue(Number(e.target.value))}
            className="vertical-range"
            title="اسحب لاختيار النسبة"
          />
        </div>
      </div>
      
      <div className="slider-value" style={{ marginTop: '1rem', fontSize: '1.5rem', color: 'var(--gold)', fontWeight: 'bold' }}>
        القيمة المحددة: %{sliderValue}
      </div>
      <p style={{fontSize: '0.9rem', color: '#ccc'}}>
        اسحب لضبط النسبة، ثم انقر على مقبض الباب لتأكيد إجابتك!
      </p>
    </div>
  );
}
