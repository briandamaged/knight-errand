
import React from 'react';
import styled from 'styled-components';

type MessageType = "request" | "response";

export interface Message {
  type: MessageType,
  content: string,
}



const Request = styled.pre `
  border: 1px solid black;
  padding: 0.5em;

  white-space: pre-wrap;
`;


const Response = styled.pre `
  border: 1px solid black;
  padding: 0.5em;
  margin-right: 2.5em;

  white-space: pre-wrap;
`;


const HistoryContainer = styled.div `
  border: 1px solid black;
  padding: 0.5em;
`

const ItemFor = (
  (type: MessageType)=>
    (type === "request")
      ? Request
      : Response
);


export const History: React.FC<{messages: Message[] }> = ({messages})=> (
  <HistoryContainer style={{overflow: "auto"}}>
    {
        messages.map(({type, content}, i)=> {
          const ItemComponent = ItemFor(type);
          return <ItemComponent key={i} >{content}</ItemComponent>
        })
    }
  </HistoryContainer>
);

export default History;
