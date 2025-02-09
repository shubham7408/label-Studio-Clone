import React, { useState } from 'react';

const ToggleButton = () => {
  const [activeButton, setActiveButton] = useState(''); // Track which button is active

  const handleInProgressClick = () => {
    setActiveButton('inProgress');
  };

  const handleCompletedClick = () => {
    setActiveButton('completed');
  };

  return (
    <div className="flex space-x-2">
      {/* In Progress Button */}
      <button
        onClick={handleInProgressClick}
        className={`px-4 py-2 rounded-lg text-xs transition duration-300 ${
          activeButton === 'inProgress'
            ? 'bg-black text-white'
            : 'bg-gray-200 text-blue-600 hover:bg-gray-300'
        }`}
      >
        In progress
      </button>

      {/* Completed Button */}
      <button
        onClick={handleCompletedClick}
        className={`px-4 py-2 rounded-lg text-xs transition duration-300 ${
          activeButton === 'completed'
            ? 'bg-black text-white'
            : 'bg-gray-200 text-blue-600 hover:bg-gray-300'
        }`}
      >
        Completed
      </button>
    </div>
  );
};

export default ToggleButton;
