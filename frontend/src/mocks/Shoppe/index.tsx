
import React from 'react';

import styled from 'styled-components';

interface Item {
  name: string;
  description: string;
  price: number;
}

const armors: Item[] = [
  {
    name: "Pocket Protector",
    description: "Offers perfect protection as long as the enemy hits your pocket.  Otherwise, it's useless.",
    price: 10.0,
  },
  {
    name: "Cliché Armor for Women",
    description: "Offers no protection whatsoever.",
    price: 250.0,
  },
  {
    name: "Cliché Armor for Men",
    description: "So heavy that it is impossible to move",
    price: 250.0,
  },
  {
    name: "Wooden Bucket",
    description: "Decent protection for your head.  Occasionally engulfs your entire head and causes temporary blindness.",
    price: 25.0,
  },
  {
    name: "Trashcan Lid",
    description: "A makeshift shield.  The smell attracts monsters.",
    price: 10.0,
  }
];


const ItemList = styled.ul `
  border: 1px solid black;
  background: #222222;
  padding: 0;
`;


const _ItemEntry = styled.li `
  list-style-type: none;
  border: 1px solid black;
  background: #eeeeee;
  margin: 0.1em;
  padding: 0.25em;

  display: grid;
  grid-template-columns: auto 20%;
  grid-template-rows: 50% 50%;
`;


const ItemName = styled.h3 `
  grid-column-start: 1;
  grid-row-start: 1;
`;

const ItemDescription = styled.p `
  grid-column-start: 1;
  grid-row-start: 2;
`;

const ItemPrice = styled.p `
  grid-column-start: 2;
  grid-row-start: 1;
`;

const PurchaseButton = styled.button `
  grid-column-start: 2;
  grid-row-start: 2;
`


const ItemEntry: React.FC<Item> = (item)=> (
  <_ItemEntry>
    <ItemName>{item.name}</ItemName>
    <ItemDescription>{item.description}</ItemDescription>
    <ItemPrice>{item.price}</ItemPrice>
    <PurchaseButton>Purchase</PurchaseButton>
  </_ItemEntry>
);


const Shoppe: React.FC = ()=> (
  <ItemList>
    { armors.map((item)=> (
      <ItemEntry {...item} />
    ))}
  </ItemList>
)

export default Shoppe;
