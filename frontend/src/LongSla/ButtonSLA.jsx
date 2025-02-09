import React from 'react';

export const ButtonSLA = ({ children, isClicked, onClick, className }) => {
  return (
    <button
      className={`py-2 px-4 w-auto text-nowrap  rounded-xl font-semibold ${isClicked ? 'bg-black text-white' : 'bg-slate-100 text-blue-600'} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
