import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { post } from '../apiCaller';
import { setUser } from '../../redux/userReducer';
import { showAlert } from '../../redux/alertReducer';
import { useSelector, useDispatch } from 'react-redux';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
      const token = localStorage.getItem('token', null);
      if(token){
        navigate('/projects');
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, []);



  const handleSubmit = (e) => {
    e.preventDefault();
    post('login', { email, password })
    .then((res) => {
      if (res.status === 200) {
        res.json().then((data) => {
          dispatch(setUser(data?.employee));
          localStorage.setItem('token', data?.token);
          localStorage.setItem('role', data?.employee?.role);
          localStorage.setItem('email', data?.employee?.email);
          navigate('/projects');
        })
      } else {
        dispatch(showAlert({ message: "Login failed", type: 'error' }));
      }
    }).catch((err) => {
      dispatch(showAlert({ message: "Login failed", type: 'error' }));
    });
  }

  const SplashScreen = () => {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">InnoSquares</h1>
          <div className="w-full max-w-xs mx-auto">
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
              </div>
              <div className="flex">
                <div className="w-full bg-gray-200 rounded-full">
                  <div className="bg-blue-500 text-xs leading-none py-1 text-center text-white rounded-full loading-bar"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {showSplash ?
        <SplashScreen /> :
        <div className="flex items-center justify-center h-screen w-screen bg-gray-100">
          <div className="flex flex-col md:flex-row w-full max-w-5xl bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-8 bg-white">
              <img
                src="/src/assets/logo.svg" // Update with the correct relative path if needed
                alt="Innoasr Logo"
                className="h-32 w-auto mb-4"
              />
              <h2 className="text-3xl font-bold mb-2 text-center">Welcome to</h2>
              <h3 className="text-2xl text-center text-blue-600 font-semibold mb-4">Innoasr Studio</h3>
              <p className="text-gray-600 text-center">Please log in to continue</p>
              {error && <p className="text-red-500 text-center">{error}</p>}
            </div>
            <div className="w-full md:w-1/2 bg-gray-200 flex items-center justify-center p-8">
              <form
                id="login-form"
                method="post"
                className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm"
                onSubmit={handleSubmit}
              >
                <div className="mb-6">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div className="flex items-center mb-6">
                  <input
                    type="checkbox"
                    id="persist_session"
                    name="persist_session"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    defaultChecked
                  />
                  <label htmlFor="persist_session" className="ml-2 text-gray-700">Keep me logged in this browser</label>
                </div>
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Log in
                </button>
              </form>
            </div>
          </div>
        </div>
      }
    </>
  );
};

export default Login; 
