import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/ui/Navbar';
import Dashboard from './pages/Dashboard';
import Clientes from './pages/Clientes';
import Agencias from './pages/Agencias';
import Pagamentos from './pages/Pagamentos';
import NotFound from './pages/NotFound';
import './styles.css';
import Agendamentos from './pages/agendamentos';


//const logoPath = "/images/fuwork.png";

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
            <Route path="/agendamentos" element={<Agendamentos />} />
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" />} />
          </Routes>
        </main>
        <footer className="footer">
          <div className="container">
            <div className="flex items-center justify-center">
              
              <p>&copy; {new Date().getFullYear()} - <b>Fuwork</b> Todos os direitos reservados.</p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;