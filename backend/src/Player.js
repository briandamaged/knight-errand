
const EventEmitter = require('events');

class Player extends EventEmitter {
  constructor({engine, location, handlers = []}) {
    super();
    
    this.engine = engine;
    this.location = location;
    this.handlers = handlers;
  }

  dispatch(cmd) {
    for(const h of this.handlers) {
      const action = h({
        sender: this,
        cmd: cmd,
      });

      if(action) {
        return action();
      }
    }

    this.inform("What?");
  }


  /**
   * Not quite the right word here.  This is intended as a way of informing the 
   * Player when something has happened in the game world.  It's not the Player
   * who is doing the informing.
   * @param {object} development 
   */
  inform(development) {
    this.emit('informed', development);
  }
}

module.exports = exports = Player;
