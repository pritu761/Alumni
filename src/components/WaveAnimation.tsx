import React from 'react';
import './WaveAnimation.css'; // Import the CSS for the wave animation

const WaveAnimation: React.FC = () => {
  return (
    <div className="wave-container">
      <div className="wave"></div>
      <div className="wave"></div>
      <div className="wave"></div>
    </div>
  );
};

export default WaveAnimation;
