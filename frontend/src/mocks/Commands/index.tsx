
import React, {FormEvent} from 'react';


interface State {
  value: string;
  log: string[];
}

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
      value: '',
      log: [],
    };
  }


  handleChange(event: FormEvent<HTMLInputElement>) {
    this.setState({
      value: event.currentTarget.value,
    });
  }

  handleSubmit(event: FormEvent<HTMLInputElement>) {
    this.ws.send(this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <div>
        <div>
          { this.state.log.map((msg, i)=> <pre key={i} >{msg}</pre>) }
        </div>
        <div>
          <input type="text" onChange={this.handleChange} ></input>
          <input type="submit" value="Send" onClick={this.handleSubmit}></input>
        </div>
      </div>
    );
  }
}


export default Commands;
