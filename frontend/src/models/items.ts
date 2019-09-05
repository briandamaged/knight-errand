// This file is just a brain dump.  Most of this will probably be
// moved server-side at some point.


export interface Item {
  name: string;
  description: string;

  plugins: Plugin[];
}

// TODO: Come up w/ a better name for this.  Maybe "Behavior"?
export interface Plugin {
  name: string;
  [key: string]: any;
}





export const Items: Item[] = [
  {
    name: "The Pizza of Wisdom",
    description: "Somehow, everybody agrees upon the toppings",
    plugins: [
      {
        name: "consumable",
      },
    ]
  },
  {
    name: "Flatu's Lance",
    description: "The spear of great wind",
    plugins: [
      {
        name: "weapon",
        attack: 5,
      },
      {
        name: "usable",
        use() {
          // break wind!
        }
      }
    ]
  },
];


export default Items;
