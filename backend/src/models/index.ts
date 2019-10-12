

export interface Character {
  getDescription(): Promise<string>,

  getLocation(): Promise<Location>,
  getItems(): Promise<Item[]>,
}



export interface Item {
  getDescription(): Promise<string>,
}


export interface Location {
  getDescription(): Promise<string>,

  getOccupants?(): Promise<Character[]>,
  getPortals?(): Promise<Portal[]>,
  getItems?(): Promise<Item[]>,
}


export interface Portal {
  getDestination(): Promise<Location>,
}

