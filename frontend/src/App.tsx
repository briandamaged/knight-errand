import React from 'react';
import styled from 'styled-components';


import Battle from './Battle';
import Shoppe from './mocks/Shoppe';

import { BrowserRouter as Router, Route, Link } from "react-router-dom";


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
        <li><Link to="/battle">Battle</Link></li>
        <li><Link to="/shoppe" >Shoppe</Link></li>
      </ul>

    </Navbar>
    <Viewport>
      <Route path="/battle" exact component={Battle} />
      <Route path="/shoppe" exact component={Shoppe} />
    </Viewport>

  </Router>
);

export default App;
