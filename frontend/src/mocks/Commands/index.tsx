
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


class Commands extends React.Component<{}, State> {
  ws: WebSocket;

  constructor(props: {}) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

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
    this.ws.send(this.state.value);
    event.preventDefault();

    this.setState({
      value: '',
    });
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

      </div>
    );
  }
}


export default Commands;
