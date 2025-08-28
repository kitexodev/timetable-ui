// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import SetupPage from './pages/SetupPage';
import ConstraintsPage from './pages/ConstraintsPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Timetable Generator</h1>
          <nav>
            <Link to="/" style={{ color: 'white', marginRight: '20px' }}>Dashboard</Link>
            <Link to="/setup" style={{ color: 'white' }}>Setup</Link>
            <Link to="/constraints" style={{ color: 'white' }}>Constraints</Link>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/setup" element={<SetupPage />} />
            <Route path="/constraints" element={<ConstraintsPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;