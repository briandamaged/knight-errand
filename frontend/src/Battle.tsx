
import React from 'react';

import styled from 'styled-components';

const Panel = styled.div `
  border: 1px solid black;
`;

const Battle: React.FC = ()=> (
  <div>
    <Panel>
      <button>Attack</button>
      <button>Item</button>
      <button>Run!!!</button>
    </Panel>
    <Panel>
      <ul>
        <li>Thug (3)</li>
        <li>Hooligan (1)</li>
      </ul>
    </Panel>
  </div>
);

export default Battle;
