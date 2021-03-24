import React from 'react';
import { Route, Switch, Redirect  } from 'react-router-dom';
import {Header, TextArea} from 'semantic-ui-react';
import Home from "./Components/Home/Home.js"
import Calculator from "./Components/Calculator/Calculator.js"

function App(props) {
  return (
    <div>
    <Switch>    
      <Route exact path="/Home" component={Home}  />
      <Route exact path="/Calculator" component={Calculator} />
      <Route exact path="/">
        <Redirect to="/Home" />
      </Route>
    </Switch>
  </div>
  );
}

export default App;
