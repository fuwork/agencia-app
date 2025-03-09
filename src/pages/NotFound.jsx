// src/pages/NotFound.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

const NotFound = () => {
  return (
    <div className="not-found">
      <h1>404</h1>
      <h2>Página não encontrada</h2>
      <p>A página que você está procurando não existe ou foi movida.</p>
      <Link to="/">
        <Button>Voltar para o Dashboard</Button>
      </Link>
    </div>
  );
};

export default NotFound;