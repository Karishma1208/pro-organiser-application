import React from 'react';
import './App.css';
import Header from './Components/Header/Header';
import {BrowserRouter as Router,Route,Switch} from 'react-router-dom';
import Home from './Pages/Home/Home';
import Create from './Pages/CreateBoard/CreateBoard';
import Board from './Pages/Board/Board';
import Login from './Pages/Login/Login';
import SignUp from './Pages/SignUp/SignUp';
import Authentication from './Context/Authentication';
import PrivateRoute from './PrivateRoute';

function App() {
  return (
    <Authentication>
      <Router>
        <Header/>
        <Switch>
        <PrivateRoute exact path="/" component={Home} />
        <PrivateRoute path="/createboard" component={Create}/>
        <PrivateRoute path="/board/:boardid" component={Board}/>
        <Route path="/SignUp" component={SignUp}/>
        <Route path="/Login" component={Login}/>
        <Route exact path="*" component={Home}/>
        </Switch>
      </Router>
    </Authentication>
  );
}

export default App;
