
import React, {FormEvent} from 'react';
import styled from 'styled-components';

interface State {
  value: string;
  log: string[];
}


const Feedback = styled.pre `
  border: 1px solid black;
  padding: 0.5em;
`;


const Navigation = styled.div `
  display: grid;

  grid-template-columns: 30% 40% 30%;
  grid-template-rows: 30% 40% 30%;
`;

const NavigationButton = styled.button `
`


class Commands extends React.Component<{}, State> {
  ws: WebSocket;

  constructor(props: {}) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleLook = this.handleLook.bind(this);
    this.go = this.go.bind(this);

    // FIXME:
    this.ws = new WebSocket("ws://localhost:5000/");

    this.ws.onmessage = (event)=> {
      this.setState({
        log: this.state.log.concat(event.data),
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

    this.setState({
      value: '',
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
      <div>

        <div>
          { this.state.log.map((msg, i)=> <Feedback key={i} >{msg}</Feedback>) }
        </div>

        <form onSubmit={this.handleSubmit}>
          <input type="text" onChange={this.handleChange} value={this.state.value} ></input>
          <input
            type="submit"
            value="Send"
            disabled={!this.isValidCommand()}
          />
        </form>

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
      </div>
    );
  }
}


export default Commands;
