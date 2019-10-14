

export interface Player {
  username: string,

  characters: Character[],
}



export interface World {

}


export interface Entity {
  getDescription(): Promise<string>,
}


export interface Character extends Entity {
  getLocation(): Promise<Location>,
  getItems(): Promise<Prop[]>,
}



export interface Prop extends Entity {

}


// Not sure if Item is really a subclass of Prop.  It's
// more like a Prop that is also carryable.
export interface Item extends Prop {

}


export interface Location extends Entity {
  getOccupants?(): Promise<Character[]>,
  getPortals(): Promise<Portal[]>,
  getProps?(): Promise<Prop[]>,
}


export interface Portal extends Entity {
  getDestination(): Promise<Location>,
}

