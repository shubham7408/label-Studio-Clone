import React, { useState, useEffect } from 'react';

const Timer = ({ time, setTime, isRunning, setIsRunning }) => {
  
  useEffect(() => {
    let timer;
    if (isRunning) {
      timer = setInterval(() => {
        setTime((prevTime) => prevTime + 10);
      }, 10);
    } else if (!isRunning && time !== 0) {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isRunning, time]);

  const formatTime = (milliseconds) => {
    const hours = Math.floor(milliseconds / 3600000);
    const minutes = Math.floor((milliseconds % 3600000) / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  return (
    <div className="flex items-center justify-center px-5 ">
      <button
        className="px-2 py-1 w-32 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-300 text-center"
        onClick={toggleTimer}
      >
        {isRunning ? 'Pause' : 'Resume'}
      </button>
      <h1 className="text-sm px-4 font-medium text-center">{formatTime(time)}</h1>
    </div>
  );
};

export default Timer;
