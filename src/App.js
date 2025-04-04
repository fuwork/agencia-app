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
    let isMounted = true; // Flag para controle de montagem

    const checkAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) throw error;

        if (isMounted) {
          setIsAuthenticated(!!data.session);
          if (data.session) {
            localStorage.setItem('authToken', data.session.access_token);
          } else {
            localStorage.removeItem('authToken');
          }
        }
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error);
        if (isMounted) {
          setIsAuthenticated(false);
          localStorage.removeItem('authToken');
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    checkAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return;
        
        switch (event) {
          case 'SIGNED_IN':
            localStorage.setItem('authToken', session.access_token);
            setIsAuthenticated(true);
            break;
          case 'SIGNED_OUT':
            localStorage.removeItem('authToken');
            setIsAuthenticated(false);
            break;
          case 'TOKEN_REFRESHED':
            if (session) {
              localStorage.setItem('authToken', session.access_token);
            }
            break;
        }
      }
    );

    return () => {
      isMounted = false;
      if (authListener?.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  // Função para lidar com login bem-sucedido
  const handleLoginSuccess = (session) => {
    localStorage.setItem('authToken', session.access_token);
    setIsAuthenticated(true);
  };

  // Função para logout
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('authToken');
      setIsAuthenticated(false);
      return true;
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      return false;
    }
  };

  if (isLoading) {
    return <div className="loading">Carregando aplicação...</div>;
  }

  return (
    <div className="App">
      <Switch>
        <Route 
          path="/sign-in" 
          render={(props) => 
            isAuthenticated ? (
              <Redirect to="/dashboard" />
            ) : (
              <SignIn {...props} onLoginSuccess={handleLoginSuccess} />
            )
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
        
        <Route path="*">
          {isAuthenticated ? <Redirect to="/dashboard" /> : <Redirect to="/sign-in" />}
        </Route>
      </Switch>
    </div>
  );
}

export default App;