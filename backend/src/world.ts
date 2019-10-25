
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


  const generalStore: Location = {
    id: "generalStore",
    getDescription() {
      return "You are in a general store.  Believe it or not, you cannot purchase generals here.  Only things.";
    },
    exits: {},
  };

  engine.addLocation(generalStore);

  const blacksmith: Location = {
    id: "blacksmith",
    getDescription() {
      return "This is a blacksmith.  You can buy swords and stuff here, or something.";
    },
    exits: {},
  }

  engine.addLocation(blacksmith);

  townSquare.exits.north = tavern.id;
  tavern.exits.south = townSquare.id;

  townSquare.exits.east = church.id;
  church.exits.west = townSquare.id;

  townSquare.exits.south = generalStore.id;
  generalStore.exits.north = townSquare.id;

  townSquare.exits.west = blacksmith.id;
  blacksmith.exits.east = townSquare.id;
}

