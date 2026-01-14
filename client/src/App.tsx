import React from 'react';
import './assets/css/App.scss';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './elements/Header';
import Dashboard from './pages/Dashboard';
import Match from './pages/Match';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/match/:eventId" element={<Match />} />
        <Route path="/match" element={<Match />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
