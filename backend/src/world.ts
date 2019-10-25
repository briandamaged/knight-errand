
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


  const church: Location = {
    id: "church",
    getDescription() {
      return "You are inside a church.  Everybody looks really prayerful.";
    },
    exits: {},
  };

  engine.addLocation(church);

  townSquare.exits.north = tavern.id;
  tavern.exits.south = townSquare.id;

  townSquare.exits.east = church.id;
  church.exits.west = townSquare.id;
}

