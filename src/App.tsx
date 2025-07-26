import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { fetchUsers } from './controllers/UserController';
import type{ User } from './models/User';
import UserView from './views/UserView';
import AboutPage from './views/About';
import './App.css';

const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetchUsers().then(setUsers);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<UserView users={users} />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </Router>
    
  );
};

export default App;
