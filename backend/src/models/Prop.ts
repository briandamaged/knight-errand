
export type PropID = string;

export interface Prop {
  id: PropID,
  name: string,
}

export interface PropContainer {
  getProps(): Promise<Prop[]>;

  addProp(prop: Prop): Promise<boolean>;
  removeProp(prop: Prop): Promise<boolean>;
}
