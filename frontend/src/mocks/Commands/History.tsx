
import React from 'react';
import styled from 'styled-components';

const Feedback = styled.pre `
  border: 1px solid black;
  padding: 0.5em;

  white-space: pre-wrap;
`;


export const History: React.FC<{messages: string[] }> = ({messages})=> (
  <div style={{overflow: "auto"}}>
    { messages.map((msg, i)=> <Feedback key={i} >{msg}</Feedback>) }
  </div>
);

export default History;
