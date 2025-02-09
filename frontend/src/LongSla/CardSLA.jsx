import React from 'react';

export const CardSLA = ({ children, className }) => {
  return (
    <div className={`bg-white p-6 ${className}`}>
      {children}
    </div>
  );
};
