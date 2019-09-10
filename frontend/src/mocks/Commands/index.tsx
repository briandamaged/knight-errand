
import React, {FormEvent} from 'react';
import styled from 'styled-components';

interface State {
  raw: string;
  valid: boolean;
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
      raw: '',
      valid: false,
      log: [],
    };
  }


  handleChange(event: FormEvent<HTMLInputElement>) {
    const raw = event.currentTarget.value;

    let valid;
    try {
      JSON.parse(raw);
      valid = true;
    } catch(err) {
      valid = false;
    }

    this.setState({
      raw: raw,
      valid: valid,
    });
  }

  handleSubmit(event: FormEvent<HTMLInputElement>) {
    this.ws.send(this.state.raw);
    event.preventDefault();
  }

  render() {
    return (
      <div>

        <div>
          { this.state.log.map((msg, i)=> <Feedback key={i} >{msg}</Feedback>) }
        </div>

        <div>
          <input type="text" onChange={this.handleChange} ></input>
          <input
            type="submit"
            value="Send"
            onClick={this.handleSubmit}
            disabled={!this.state.valid}
          />
        </div>

      </div>
    );
  }
}


export default Commands;
