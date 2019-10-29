
import React, {FormEvent} from 'react';
import styled from 'styled-components';

import {
  Box, Grid,
} from 'grommet';


import {History, Message} from './History';

interface State {
  value: string;
  log: Message[];
}


const Navigation = styled.div `
  display: grid;

  grid-template-columns: 30% 40% 30%;
  grid-template-rows: 30% 40% 30%;
`;

const NavigationButton = styled.button `
`

const MainGrid = styled(Grid) `
  height: 100%;
`;

class Commands extends React.Component<{}, State> {
  ws: WebSocket;
  historyBottom?: HTMLDivElement;

  constructor(props: {}) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleLook = this.handleLook.bind(this);
    this.go = this.go.bind(this);

    // FIXME:
    this.ws = new WebSocket("ws://localhost:5000/");

    this.ws.onmessage = (event)=> {
      const response: Message = {
        type: "response",
        content: event.data,
      };

      this.setState({
        log: this.state.log.concat(response),
      }, ()=> {
        if(this.historyBottom) {
          this.historyBottom.scrollIntoView();
          console.log("wat?");
        }
      });
    }

    this.state = {
      value: "",
      log: [],
    };
  }


  handleChange(event: FormEvent<HTMLInputElement>) {
    this.setState({
      value: event.currentTarget.value,
    });
  }

  handleSubmit(event: FormEvent<HTMLFormElement>) {
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

  handleLook(event: React.MouseEvent) {
    event.preventDefault();
    const serializedCommand = JSON.stringify({
      name: "look",
    });
    this.ws.send(serializedCommand);
  }

  go(direction: string) {
    return (event: React.MouseEvent)=> {
      event.preventDefault();
      const serializedCommand = JSON.stringify({
        name: "go",
        direction: direction,
      });
      this.ws.send(serializedCommand);
    }
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
          <History
            messages={ this.state.log }
            ref={ (e: HTMLDivElement)=> this.historyBottom = e }
          />
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
          <Navigation>
            <NavigationButton onClick={this.go("northwest") } >NW</NavigationButton>
            <NavigationButton onClick={this.go("north") } >North</NavigationButton>
            <NavigationButton onClick={this.go("northeast") } >NE</NavigationButton>
            <NavigationButton onClick={this.go("west") } >West</NavigationButton>
            <NavigationButton onClick={this.handleLook } >LOOK</NavigationButton>
            <NavigationButton onClick={this.go("east") } >East</NavigationButton>
            <NavigationButton onClick={this.go("southwest") } >SW</NavigationButton>
            <NavigationButton onClick={this.go("south") } >South</NavigationButton>
            <NavigationButton onClick={this.go("southeast") } >SE</NavigationButton>
          </Navigation>
        </Box>
      </MainGrid>
    );
  }
}


export default Commands;
