
import {
  Character,
} from './models/Character';

import GameEngine from './GameEngine';
import { Edible } from './plugins/consumables';
import { Prop } from './models/Prop';


export async function createWorld({engine}: {engine: GameEngine}): Promise<void> {

  const townSquare = engine.createLocation({
    id: "townSquare",
    name: "Town Square",

    getDescription() {
      return "It's more of a Village Oval, if we're being perfectly honest.";
    }
  });


  const tavern = engine.createLocation({
    name: "The Party Yawn Tavern and Inn",
    description: "The sign on the door says 'The Party Yawn'",
  });


  const church = engine.createLocation({
    name: "The Church of St. God",
    description: "You are inside a church.  Everybody looks really prayerful.",
  });


  const generalStore = engine.createLocation({
    name: "The General Store",
    description: "You are in a general store.  Believe it or not, you cannot purchase generals here.  Only things.",
  });

  const blacksmith =  engine.createLocation({
    name: "The Blacksmith",
    description: "This is a blacksmith.  You can buy swords and stuff here, or something.",
  });



  townSquare.exits.north = tavern.id;
  tavern.exits.south = townSquare.id;

  townSquare.exits.east = church.id;
  church.exits.west = townSquare.id;

  townSquare.exits.south = generalStore.id;
  generalStore.exits.north = townSquare.id;

  townSquare.exits.west = blacksmith.id;
  blacksmith.exits.east = townSquare.id;

  const trash01 = engine.createProp({
    id: "trash01",
    name: "gawbij",
  });

  const trash02 = engine.createProp({
    id: "trash02",
    name: "trash",
  });

  const apple = engine.createProp({
    id: "apple",
    name: "apple",

    canBeEatenBy({eater}: {eater: Character}) {
      return true;
    },

    beEatenBy({eater}: {eater: Character}) {
      eater.inform("Tasty!");
    },
  });

  townSquare.addProp(trash01);
  generalStore.addProp(apple);
  tavern.addProp(trash02);
}
