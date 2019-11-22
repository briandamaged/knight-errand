
import {
  Character,
} from './models/Character';

import GameEngine from './GameEngine';
import { Edible } from './plugins/consumables';
import { Prop } from './models/Prop';



const AppleFactory = (
  (engine: GameEngine)=>
    function Apple() {
      return engine.createProp({
        name: "apple",
    
        canBeEatenBy({eater}: {eater: Character}) {
          return true;
        },
    
        beEatenBy({eater}: {eater: Character}) {
          eater.inform("Tasty!");
        },
      });
    }
);


const TreeFactory = (
  (engine: GameEngine)=>
    function Tree() {
      return engine.createProp({
        name: "tree",

        canProduce(target: string) {
          return (["apple", "fruit"].includes(target))
        },

        produce(target: string) {
          if(["apple", "fruit".includes(target)]) {
            const Apple = AppleFactory(engine);
            return Apple();
          }
        }
      });
    }
)


export async function createWorld({engine}: {engine: GameEngine}): Promise<void> {

  const Apple = AppleFactory(engine);
  const Tree = TreeFactory(engine);

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

  const tree = Tree();
  const apple = Apple();

  const wine = engine.createProp({
    name: "wine",

    canBeDrunkBy() {
      return true;
    },

    beDrunkBy({drinker}: {drinker: Character}) {
      drinker.inform("Glug glug glug...");
    },
  });


  townSquare.addProp(tree);
  generalStore.addProp(apple);
  tavern.addProp(wine);
}
