
import {
  Location,
} from './models';

import GameEngine from './GameEngine';

// Town Hall
// Church
// Clinic
// 



export function createWorld({engine}: {engine: GameEngine}): void {

  const townSquare: Location = {
    id: "townSquare",
    getDescription() {
      return "It's more of a Village Oval, if we're being perfectly honest.";
    },
    exits: {},
  };

  engine.addLocation(townSquare);


  const tavern: Location = {
    id: "tavern",
    getDescription() {
      return "The sign on the door says 'The Party Yawn'";
    },
    exits: {},
  };

  engine.addLocation(tavern);

  townSquare.exits.north = tavern.id;
  tavern.exits.south = townSquare.id;
}

