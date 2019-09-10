
const EventEmitter = require('events');

class Player extends EventEmitter {
  constructor({engine, location}) {
    super();
    
    this.engine = engine;
    this.location = location;
  }

  dispatch(cmd) {
    this.engine.dispatch(cmd);
  }
}

module.exports = exports = Player;
