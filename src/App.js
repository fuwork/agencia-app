// src/App.jsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/ui/Navbar';
import Dashboard from './pages/Dashboard';
import Clientes from './pages/Clientes';
import Agencias from './pages/Agencias';
import Pagamentos from './pages/Pagamentos';
import NotFound from './pages/NotFound';
import { testSupabaseConnection } from './services/supabase';
import './styles.css';

const App = () => {
  const [connectionTested, setConnectionTested] = useState(false);
  const [connectionError, setConnectionError] = useState(null);

  useEffect(() => {
    // Testar a conexão com o Supabase quando o aplicativo iniciar
    const checkConnection = async () => {
      try {
        const result = await testSupabaseConnection();
        if (!result.success) {
          setConnectionError('Erro na conexão com Supabase. Verifique as credenciais e configurações.');
        }
      } catch (e) {
        setConnectionError('Erro ao testar conexão: ' + e.message);
      } finally {
        setConnectionTested(true);
      }
    };

    checkConnection();
  }, []);

  if (!connectionTested) {
    return (
      <div className="app-loading">
        <div className="loading-container">
          <h2>Carregando aplicação...</h2>
          <p>Verificando conexão com o banco de dados</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          {connectionError && (
            <div className="connection-error">
              <h3>Erro de Conexão</h3>
              <p>{connectionError}</p>
              <p>Verifique suas credenciais do Supabase em src/services/supabase.js</p>
            </div>
          )}
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