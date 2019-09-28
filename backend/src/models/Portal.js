
const EventEmitter = require('events');

class Portal extends EventEmitter {
  constructor({}) {

  }

  canEnter({character}) {
    return true;
  }

  enter({character}) {
    this.emit('entered', {character});
  }

  getDestination({character}) {

  }

}
