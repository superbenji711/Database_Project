import React from 'react';
import { Route, Switch, Redirect  } from 'react-router-dom';
import {Header, TextArea} from 'semantic-ui-react';
import Home from "./Views/Home/Home.js"
import StockCorrelator from "./Views/Correlator/StockCorrelator"
import Correlator from "./Views/Correlator/EconomicCorrelator.js"
import NavBar from "./Component/navigation/NavBar"


const App= () => {
  return (
    <div>

    <NavBar/>
      
    <Switch>    
      <Route exact path="/Home" component={Home}  />
      <Route exact path="/Stock Correlator" component={StockCorrelator} />
      <Route exact path="/Correlator" component={Correlator} />

      <Route exact path="/">
        <Redirect to="/Home" />
      </Route>
    </Switch>
  </div>
  );
}

export default App;
