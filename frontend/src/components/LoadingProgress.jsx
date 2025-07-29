import React from 'react';

const LoadingProgress = ({ progress, status }) => {
  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <h3 className="loading-title">Analyzing Sentiment</h3>
      <p className="loading-status">{status}</p>
      
      <div className="progress-bar-container">
        <div 
          className="progress-bar" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      <p className="progress-text">
        {Math.round(progress)}% complete
      </p>
    </div>
  );
};

export default LoadingProgress;
