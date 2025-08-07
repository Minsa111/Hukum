import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import './App.css';

import LoginPage from './views/login';
import Dashboard from './views/dashboard';
import {ProtectedDashboardRoute, ProtectedLoginRoute} from './routes/protectedroute';


const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(()=>{
    const loggedIn = localStorage.getItem("isLoggedIn")==="true";
    setIsLoggedIn(loggedIn);
  });

  return (
    <Router>
      <Routes>
        <Route path='/' 
          element={
            isLoggedIn?(
            <Navigate to ='/dashboard' replace/>): (<Navigate to ='/login' replace/>)
          }/>
  
        <Route path="/dashboard" element={
          <ProtectedDashboardRoute>
            <Dashboard />
          </ProtectedDashboardRoute>
        }
        />
          <Route path='/login' 
            element={
              <ProtectedLoginRoute>
                <LoginPage/>
              </ProtectedLoginRoute>
            } />
      </Routes>
    </Router>
  );
};

export default App;