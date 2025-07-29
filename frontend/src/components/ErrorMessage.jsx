import React from 'react';

const ErrorMessage = ({ title, message }) => {
  return (
    <div className="error-container">
      <h3 className="error-title">{title}</h3>
      <p className="error-message">{message}</p>
    </div>
  );
};

export default ErrorMessage;
