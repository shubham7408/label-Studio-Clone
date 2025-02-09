import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MuiAlert from '@mui/material/Alert';
import { hideAlert } from '../../redux/alertReducer';

function Alert() {
  const dispatch = useDispatch();
  const { open, message, type } = useSelector((state) => state.alert);

  useEffect(() => {
    let timeoutId;

    if (open) {
      timeoutId = setTimeout(() => {
        dispatch(hideAlert());
      }, 5000);
    }

    return () => clearTimeout(timeoutId);
  }, [open, dispatch]);

  const handleCloseAlert = () => {
    dispatch(hideAlert());
  };

  return (
    <div className="alert-container absolute top-12 right-2 z-50">
      {open && (
        <MuiAlert
          elevation={6}
          variant="filled"
          severity={type}
          onClose={handleCloseAlert}
          sx={{ marginTop: 2 }}>
          {message}
        </MuiAlert>
      )}
    </div>
  );
}

export default Alert;
