import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
// import React, { useEffect, useState } from 'react';
import './App.css';
// import PublicDashboard from
import LoginPage from './views/login';
import Dashboard from './views/user/dashboard';
import PublicDashboard from './views/public/public-dashboard';
import ShopReport from './views/user/shopreport';
import {ProtectedAdminRoute, ProtectedLoginRoute} from './routes/protectedroute';

const App: React.FC = () => {
  // const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // useEffect(()=>{
  //   const loggedIn = localStorage.getItem("isLoggedIn")==="true";
  //   setIsLoggedIn(loggedIn);
  // });

  return (
    <Router>
      <Routes>
        <Route path='/' 
          element={
            <Navigate to = {'/public-dashboard'}/> 
          }/>
        <Route path='/public-dashboard' element={
          <PublicDashboard/>
        }/>
        <Route path="/dashboard" element={
          <ProtectedAdminRoute>
            <Dashboard />
          </ProtectedAdminRoute>
        }/>
        <Route path="/pembelanjaan" element={
          <ProtectedAdminRoute>
            <ShopReport />
          </ProtectedAdminRoute>
        }/>
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