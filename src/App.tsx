import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { fetchUsers } from './controllers/UserController';
import UserView from './views/userview';
import LoginPage from './views/login';
import AboutPage from './views/about';
import type{ User } from './models/User';
import './App.css';

const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetchUsers().then(setUsers);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<UserView users = {users}  />} />
        <Route path="/dashboard" element={<AboutPage />} />
        <Route path='/login' element={<LoginPage/>} />
      </Routes>
    </Router>
  );
};

export default App;