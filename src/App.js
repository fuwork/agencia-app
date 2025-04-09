import { Switch, Route, Redirect } from "react-router-dom";
import { useState, useEffect } from "react";
import Home from "./pages/Home";
import Agenda from "./pages/Agenda_Post";
import SignIn from "./pages/SignIn";
import Clientes from "./pages/Clientes";
import Pagamentos from "./pages/Pagamentos";
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
    const abortController = new AbortController();

    const checkAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) throw error;

        if (!abortController.signal.aborted) {
          setIsAuthenticated(!!data.session);
          if (data.session) {
            localStorage.setItem('authToken', data.session.access_token);
          } else {
            localStorage.removeItem('authToken');
          }
        }
      } catch (error) {
        if (!abortController.signal.aborted) {
          console.error("Erro na verificação de autenticação:", error);
        }
      } finally {
        if (!abortController.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    checkAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (abortController.signal.aborted) return;
        
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
          default:
            break;
        }
      }
    );

    return () => {
      abortController.abort();
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
          component={Pagamentos} 
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