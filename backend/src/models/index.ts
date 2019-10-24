
type ID = string;

export interface Entity {
  id: ID,
}

export interface Location extends Entity {
  getDescription(): string,
}
