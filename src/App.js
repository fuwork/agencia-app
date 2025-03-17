import { Switch, Route, Redirect } from "react-router-dom";
import Home from "./pages/Home";
import Agenda from "./pages/Agendamento/Calendario";
import SignIn from "./pages/SignIn";
import Clientes from "./pages/Clientes";
import pagamentos from "./pages/Pagamentos";
import Main from "./components/layout/Main";
import "antd/dist/antd.css";
import "./assets/styles/main.css";
import "./assets/styles/responsive.css";
import './pages/Agendamento/components/Components-Calendario-css.css';
import './styles/styles.css';


import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

function App() {
  return (
    <div className="App">
      <Switch>
        <Route path="/sign-in" exact component={SignIn} />
        <Main>
          <Route exact path="/dashboard" component={Home} />
          <Route exact path="/pagamentos" component={pagamentos} />
          <Route exact path="/Clientes" component={Clientes} />
          <Route exact path="/Agenda" component={Agenda} />
          <Redirect from="*" to="/dashboard" />
        </Main>
      </Switch>
    </div>
  );
}

export default App;
