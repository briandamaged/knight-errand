
export type PropID = string;

export interface Prop {
  id: PropID,
  name: string,
}

export interface PropContainer {
  getProps(): Promise<Prop[]>;
}
