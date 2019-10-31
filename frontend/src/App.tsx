import React from 'react';
import styled from 'styled-components';
import {
  Grommet,
} from 'grommet';


import Commands from './mocks/Commands';
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
  <Grommet plain full>
    <Commands />
  </Grommet>
);

export default App;
