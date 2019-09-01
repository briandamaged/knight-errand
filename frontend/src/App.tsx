import React from 'react';
import styled from 'styled-components';

import logo from './logo.svg';
import './App.css';

import Battle from './Battle';

import { BrowserRouter as Router, Route, Link } from "react-router-dom";

const Home: React.FC = ()=> (
  <div className="App">
    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <p>
        Edit <code>src/App.tsx</code> and save to reload.
      </p>
      <a
        className="App-link"
        href="https://reactjs.org"
        target="_blank"
        rel="noopener noreferrer"
      >
        Learn React
      </a>
    </header>
  </div>
);


const Navbar = styled.nav `
  display: inline-block;
  padding: 1em;
`;

const Viewport = styled.div `
  display: inline-block;
`;

const App: React.FC = ()=> (
  <Router>
    <Navbar>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/battle">Battle</Link></li>
      </ul>

    </Navbar>
    <Viewport>
      <Route path="/" exact component={Home} />
      <Route path="/battle" exact component={Battle} />
    </Viewport>

  </Router>
);

export default App;
