import { Outlet } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import Alert from '../../Components/Alert/Alert';
import ProgressBar from '../ProgressBar/ProgressBar';

const MainLayout = () => {
    return (
        <div>
            <ProgressBar/>
            <Alert />
            <Outlet />
        </div>
    );
};

export default MainLayout;
