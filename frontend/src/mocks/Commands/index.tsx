
import React, {FormEvent} from 'react';
import styled from 'styled-components';

import {
  Box, Grid,
} from 'grommet';


import {History, Message} from './History';
import Navigation from './Navigation';

interface State {
  value: string;
  log: Message[];
}


const MainGrid = styled(Grid) `
  height: 100%;
`;

const HistoryPanel = styled(Box) `
  border: 1px solid lime;
  background-color: black;
  margin: 1em;
`

const ParserContainer = styled.div `
  display: grid;
  grid-template-columns: 2em auto 5em;
  grid-template-rows: 100%;

  background-color: #222222;
  color: lime;

  font-size: 18px;
  font-family: Courier New;
`

const ParserText = styled.input `
  border: none;
  background-color: #222222;
  color: lime;

  font-size: 18px;
  font-family: Courier New;
`

class Commands extends React.Component<{}, State> {
  ws: WebSocket;

  constructor(props: {}) {
    super(props);

    // FIXME:
    this.ws = new WebSocket("ws://localhost:5000/");

    this.ws.onmessage = (event)=> {
      const response: Message = {
        type: "response",
        content: event.data,
      };

      this.setState({
        log: this.state.log.concat(response),
      });
    }

    this.state = {
      value: "",
      log: [],
    };
  }

  handleChange = (event: FormEvent<HTMLInputElement>)=> {
    this.setState({
      value: event.currentTarget.value,
    });
  }

  handleSubmit = (event: FormEvent<HTMLFormElement>)=> {
    const serializedCommand = JSON.stringify({
      "name": "raw",
      "content": this.state.value,
    });

    this.ws.send(serializedCommand);
    event.preventDefault();

    const request: Message = {
      type: "request",
      content: this.state.value,
    };

    this.setState({
      value: '',
      log: this.state.log.concat(request),
    });
  }

  handleCommand = (cmd: any)=> {
    const serializedCommand = JSON.stringify(cmd);
    this.ws.send(serializedCommand)
  }

  isValidCommand() {
    return this.state.value !== "";
  }

  render() {
    return (
      <MainGrid
        rows={["80%", "20%"]}
        columns={["1/2", "1/2"]}
        areas={[
          { name: 'log', start: [0, 0], end: [0, 0] },
          { name: 'navigation', start: [1, 0], end: [1, 0] },
        ]}
      >

        <HistoryPanel gridArea="log" >
          <History messages={ this.state.log } />

          <form onSubmit={this.handleSubmit}>
            <ParserContainer>
              <p>&nbsp;&gt;</p>
              <ParserText type="text" onChange={this.handleChange} value={this.state.value} />
              <input
                type="submit"
                value="Send"
                disabled={!this.isValidCommand()}
              />
            </ParserContainer>
          </form>
        </HistoryPanel>


        <Box gridArea="navigation" >
          <Navigation onCommand={ this.handleCommand } />
        </Box>
      </MainGrid>
    );
  }
}


export default Commands;
