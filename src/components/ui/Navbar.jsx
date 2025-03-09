// src/components/ui/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="navbar-brand">Sistema de Gestão</Link>
        <div className="navbar-menu">
          <Link to="/clientes" className="navbar-item">Clientes</Link>
          <Link to="/agencias" className="navbar-item">Agências</Link>
          <Link to="/pagamentos" className="navbar-item">Pagamentos</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;