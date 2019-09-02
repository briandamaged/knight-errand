
import React from 'react';

import styled from 'styled-components';

const armors = [
  {
    name: "Pocket Protector",
    description: "Offers perfect protection as long as the enemy hits your pocket.  Otherwise, it's useless.",
  },
  {
    name: "Cliché Armor for Women",
    description: "Offers no protection whatsoever.",
  },
  {
    name: "Cliché Armor for Men",
    description: "So heavy that it is impossible to move",
  },
  {
    name: "Wooden Bucket",
    description: "Decent protection for your head.  Occasionally engulfs your entire head and causes temporary blindness.",
  },
  {
    name: "Trashcan Lid",
    description: "A makeshift shield.  The smell attracts monsters.",
  }
];

const Shoppe: React.FC = ()=> (
  <dl>
    { armors.map(({name, description})=> (
      <>
        <dt>{name}</dt>
        <dd>{description}</dd>
      </>
    ))}
  </dl>
)

export default Shoppe;
