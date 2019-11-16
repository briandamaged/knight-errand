
import {
  Location, Prop, Character,
} from './models';

import GameEngine from './GameEngine';
import { Edible } from './plugins/consumables';

// Town Hall
// Church
// Clinic
// 



export function createWorld({engine}: {engine: GameEngine}): void {

  const townSquare: Location = {
    id: "townSquare",
    name: "Town Square",

    getDescription() {
      return "It's more of a Village Oval, if we're being perfectly honest.";
    },

    propIDs: [],
    exits: {},
  };

  engine.addLocation(townSquare);


  const tavern: Location = {
    id: "tavern",
    name: "The Party Yawn Tavern and Inn",

    getDescription() {
      return "The sign on the door says 'The Party Yawn'";
    },

    propIDs: [],
    exits: {},
  };

  engine.addLocation(tavern);


  const church: Location = {
    id: "church",
    name: "The Church of St. God",

    getDescription() {
      return "You are inside a church.  Everybody looks really prayerful.";
    },

    propIDs: [],
    exits: {},
  };

  engine.addLocation(church);


  const generalStore: Location = {
    id: "generalStore",
    name: "The General Store",

    getDescription() {
      return "You are in a general store.  Believe it or not, you cannot purchase generals here.  Only things.";
    },

    propIDs: [],
    exits: {},
  };

  engine.addLocation(generalStore);

  const blacksmith: Location = {
    id: "blacksmith",
    name: "The Blacksmith",

    getDescription() {
      return "This is a blacksmith.  You can buy swords and stuff here, or something.";
    },

    propIDs: [],
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



  const trash01: Prop = {
    id: "trash01",
    name: "gawbij",
  };

  const trash02: Prop = {
    id: "trash02",
    name: "trash",
  };

  const apple: Prop & Edible = {
    id: "apple",
    name: "apple",

    canBeEatenBy({eater}: {eater: Character}) {
      return true;
    },

    beEatenBy({eater}: {eater: Character}) {
      eater.inform("No!  I refuse to be destroyed");
    },
  };

  engine.addProp(trash01);
  engine.addProp(trash02);
  engine.addProp(apple);

  townSquare.propIDs.push(trash01.id);
  generalStore.propIDs.push(apple.id);
  tavern.propIDs.push(trash02.id);
}
