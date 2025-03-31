import { Switch, Route, Redirect } from "react-router-dom";
import { useState, useEffect } from "react";
import Home from "./pages/Home";
import Agenda from "./pages/Agendamento/Calendario";
import SignIn from "./pages/SignIn";
import Clientes from "./pages/Clientes";
import pagamentos from "./pages/Pagamentos";
import Main from "./components/layout/Main";
import Controle from "./pages/ControleAD";
import "antd/dist/antd.css";
import "./assets/styles/main.css";
import "./assets/styles/responsive.css";
import './pages/Agendamento/components/Components-Calendario-css.css';
import './styles/styles.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// Componente de rota protegida
const ProtectedRoute = ({ component: Component, isAuthenticated, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      isAuthenticated ? (
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
  
  useEffect(() => {
    // Verifique se o usuário está autenticado
    // Isso pode ser feito verificando um token no localStorage ou sessionStorage
    const token = localStorage.getItem('authToken');
    setIsAuthenticated(!!token);
  }, []);

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
        />
        <ProtectedRoute 
          exact 
          path="/pagamentos" 
          component={pagamentos} 
          isAuthenticated={isAuthenticated} 
        />
        <ProtectedRoute 
          exact 
          path="/Clientes" 
          component={Clientes} 
          isAuthenticated={isAuthenticated} 
        />
        <ProtectedRoute 
          exact 
          path="/Agenda" 
          component={Agenda} 
          isAuthenticated={isAuthenticated} 
        />
        <ProtectedRoute 
          exact 
          path="/ControleAD" 
          component={Controle} 
          isAuthenticated={isAuthenticated} 
        />
        
        {/* Redireciona para sign-in se não estiver autenticado ou para dashboard se estiver */}
        <Route path="*">
          {isAuthenticated ? <Redirect to="/dashboard" /> : <Redirect to="/sign-in" />}
        </Route>
      </Switch>
    </div>
  );
}

export default App;