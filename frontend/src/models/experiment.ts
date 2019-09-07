

export interface Entity {
  id: string;
  name: string;
  description?: string;
}

export interface EntityConfig {
  name: string;
  description?: string;
}

let nextEntityId = 1;

function createEntity({name, description} : EntityConfig): Entity {
  const entity = {
    id: `${nextEntityId++}`,
    name: name,
    description: description,
  };

  return entity;
}




export interface Location {
  id: string;
  name: string;
  description: string;

  entities: Entity[];
}

export interface LocationConfig {
  name: string;
  description?: string;
  entities?: Entity[];
}

let nextLocationId = 1;
function createLocation({name, description = '', entities = []} : LocationConfig): Location {
  const location = {
    id: `${nextLocationId++}`,
    name: name,
    description: description,
    entities: entities,
  };

  return location;
}






class GameEngine {
  entities: Record<string, Entity> = {};
  locations: Record<string, Location> = {};

  registryEntity(e: Entity) {
    this.entities[e.id] = e;
  }

  unregisterEntity(e: Entity) {
    delete this.entities[e.id];
  }
}





const player = createEntity({
  name: "The Player",
});




const townSquare = createLocation({
  name: "Town Square",
  description: "It's more of a Village Oval, if we're being honest.",
});


const inn = createLocation({
  name: "The Inn",
});

