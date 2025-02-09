import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import LinearProgress from '@mui/material/LinearProgress';

function ProgressBar() {
  const { open } = useSelector((state) => state.progressBar);
  return (
    <div className="progress-bar-container absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
      {open && <LinearProgress color="primary" />}
    </div>
  );
}

export default ProgressBar;
