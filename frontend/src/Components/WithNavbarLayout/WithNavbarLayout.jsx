import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../../redux/userReducer';
import { authorizedPost } from '../../Pages/apiCaller';

const WithNavbarLayout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = localStorage.getItem('token', null);
  const email = localStorage.getItem('email', null);
  useEffect(() => {
    if (!token) {
      navigate('/');
    }else{
       authorizedPost('getEmployeeData', { email: email }).then((res) => {
        if (res.status === 200) {
          res.json().then((data) => {
            dispatch(setUser(data?.user));
            localStorage.setItem('role', data?.user?.role);
            localStorage.setItem('email', data?.user?.email);
          })
        } else if(res.status === 401){
          localStorage.clear();
          navigate('/');
        }else {
          // console.log('Login failed:', res.data);
        }
      });
    }
  });

  return (
    <div>
      <Navbar />
      <div className="pt-14">
        <Outlet />
      </div>
    </div>
  );
};

export default WithNavbarLayout;
