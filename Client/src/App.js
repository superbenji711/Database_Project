import React from 'react';
import { Route, Switch, Redirect  } from 'react-router-dom';
import {Header, TextArea} from 'semantic-ui-react';
import Home from "./Views/Home/Home.js"
import Calculator from "./Views/Calculator/Calculator.js"
import Correlator from "./Views/Correlator/Correlator.js"
import NavBar from "./Component/navigation/NavBar"


const App= () => {
  return (
    <div style={{paddingTop:10}}>

    <NavBar/>
      
    <Switch>    
      <Route exact path="/Home" component={Home}  />
      <Route exact path="/Calculator" component={Calculator} />
      <Route exact path="/Correlator" component={Correlator} />

      <Route exact path="/">
        <Redirect to="/Home" />
      </Route>
    </Switch>
  </div>
  );
}

export default App;
