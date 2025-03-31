import { Switch, Route, Redirect } from "react-router-dom";
import { useState, useEffect } from "react";
import Home from "./pages/Home";
import Agenda from "./pages/Agendamento/Calendario";
import SignIn from "./pages/SignIn";
import Clientes from "./pages/Clientes";
import pagamentos from "./pages/Pagamentos";
import Main from "./components/layout/Main";
import Controle from "./pages/ControleAD";
import { supabase } from "./services/supabase";
import "antd/dist/antd.css";
import "./assets/styles/main.css";
import "./assets/styles/responsive.css";
import './pages/Agendamento/components/Components-Calendario-css.css';
import './styles/styles.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// Componente de rota protegida
const ProtectedRoute = ({ component: Component, isAuthenticated, isLoading, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      isLoading ? (
        <div className="loading">Verificando autenticação...</div>
      ) : isAuthenticated ? (
        <Main>
          <Component {...props} />
        </Main>
      ) : (
        <Redirect to="/sign-in" />
      )
    }
  />
);

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Verificar a sessão ativa do Supabase
        const { data } = await supabase.auth.getSession();
        
        // Só consideramos autenticado se houver uma sessão válida
        if (data.session) {
          setIsAuthenticated(true);
        } else {
          // Se não há sessão, forçamos como não autenticado
          setIsAuthenticated(false);
          // Limpa qualquer token que possa estar no localStorage
          localStorage.removeItem('authToken');
        }
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Configurar listener para mudanças de estado de autenticação
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          localStorage.setItem('authToken', session.access_token);
          setIsAuthenticated(true);
        } else if (event === 'SIGNED_OUT') {
          localStorage.removeItem('authToken');
          setIsAuthenticated(false);
        }
      }
    );

    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  // Enquanto estiver carregando, pode mostrar um indicador de carregamento
  if (isLoading) {
    return <div className="loading">Carregando aplicação...</div>;
  }

  return (
    <div className="App">
      <Switch>
        <Route 
          path="/sign-in" 
          render={(props) => 
            isAuthenticated ? <Redirect to="/dashboard" /> : <SignIn {...props} />
          } 
        />
        
        <ProtectedRoute 
          exact 
          path="/dashboard" 
          component={Home} 
          isAuthenticated={isAuthenticated}
          isLoading={isLoading}
        />
        <ProtectedRoute 
          exact 
          path="/pagamentos" 
          component={pagamentos} 
          isAuthenticated={isAuthenticated}
          isLoading={isLoading}
        />
        <ProtectedRoute 
          exact 
          path="/Clientes" 
          component={Clientes} 
          isAuthenticated={isAuthenticated}
          isLoading={isLoading}
        />
        <ProtectedRoute 
          exact 
          path="/Agenda" 
          component={Agenda} 
          isAuthenticated={isAuthenticated}
          isLoading={isLoading}
        />
        <ProtectedRoute 
          exact 
          path="/ControleAD" 
          component={Controle} 
          isAuthenticated={isAuthenticated}
          isLoading={isLoading}
        />
        
        {/* Redireciona para sign-in para qualquer rota não definida */}
        <Route path="*">
          <Redirect to="/sign-in" />
        </Route>
      </Switch>
    </div>
  );
}

export default App;