
const EventEmitter = require('events');

class GameEngine extends EventEmitter {
  constructor({} = {}) {
    super();
  }

  dispatch(cmd) {
    this.emit('inform', "Yay");
  }
}

module.exports = exports = GameEngine;
