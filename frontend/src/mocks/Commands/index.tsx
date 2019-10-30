
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
          { name: 'parser', start: [0, 1], end: [0, 1] },
          { name: 'navigation', start: [1, 0], end: [1, 0] },
        ]}
      >

        <Box gridArea="log" >
          <History messages={ this.state.log } />
        </Box>

        <Box gridArea="parser" >
          <form onSubmit={this.handleSubmit}>
            <input type="text" onChange={this.handleChange} value={this.state.value} ></input>
            <input
              type="submit"
              value="Send"
              disabled={!this.isValidCommand()}
            />
          </form>
        </Box>



        <Box gridArea="navigation" >
          <Navigation onCommand={ this.handleCommand } />
        </Box>
      </MainGrid>
    );
  }
}


export default Commands;
