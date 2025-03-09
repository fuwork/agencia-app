// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/ui/Navbar';
import Dashboard from './pages/Dashboard';
import Clientes from './pages/Clientes';
import Agencias from './pages/Agencias';
import Pagamentos from './pages/Pagamentos';
import NotFound from './pages/NotFound';
import './styles.css';

const App = () => {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/clientes" element={<Clientes />} />
            <Route path="/agencias" element={<Agencias />} />
            <Route path="/pagamentos" element={<Pagamentos />} />
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" />} />
          </Routes>
        </main>
        <footer className="footer">
          <div className="container">
            <p>&copy; {new Date().getFullYear()} - Sistema de Gestão</p>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;