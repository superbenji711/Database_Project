import logo from './logo.svg';
import './App.css';
import {Header, TextArea} from 'semantic-ui-react';

function App() {
  return (
    <div className="App">
      <Header>
        Database Project
      </Header>
      <TextArea value={'hello world!!!'}/>
    </div>
  );
}

export default App;
