
import React from 'react';
import styled from 'styled-components';

type MessageType = "request" | "response";

export interface Message {
  type: MessageType,
  content: string,
}


const BaseMessage = styled.pre `
  font-size: 18px;
  padding: 0 0.5em 0 0.5em;
  margin: 0.3em;

  white-space: pre-wrap;
  color: white;
`;

const Request = styled(BaseMessage) `
  &:before {
    content: '> ';
  }
`;


const Response = styled(BaseMessage) `
  margin-left: 5em;
`;


const HistoryContainer = styled.div `
  height: 100%;
  border: 1px solid black;
  padding: 0.5em;

  background-color: #bbbbff;
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
