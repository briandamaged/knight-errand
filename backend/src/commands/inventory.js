
const _ = require('lodash');

const {compose} = require('redecor8');



function _getItems(sender) {
  return sender.inventory;
}


const handleHallucinations = (
  (next)=>
    async function(sender) {
      const items = await next(sender);
      if(!sender.hallucinating) {
        return items;
      }

      const reportedItems = Array.from(items);
      while(true) {
        if(Math.random() < 0.5) {
          break;
        }

        reportedItems.push({
          name: _.sample([
            "snake", "bicycle", "rainbow",
            "happiness", "bugs",
          ]),
        });
      }

      return _.shuffle(reportedItems);
    }
);


/**
 * When you're blind, you can't actually see all of your items.
 * So, random things will be removed from the output.
 * @param {function} next 
 */
const handleBlindness = (
  (next)=>
    async function(sender) {
      const items = await next(sender);
      if(!sender.blind) {
        return items;
      }

      const reportedItems = [];
      for(const it of items) {
        if(Math.random() < 0.7) {
          reportedItems.push(it);
        }
      }

      return reportedItems;
    }
);

const getItems = compose([
  handleHallucinations,
  handleBlindness,
])(_getItems);



function _renderItem(item) {
  return item.name;
}

const renderItem = compose([

])(_renderItem);


async function _inventory({sender}) {
  const items = await getItems(sender);

  if(items.length === 0) {
    sender.inform("You are not carrying anything");
  } else {
    const listing = items.map((it)=> ` - ${renderItem(it)}`).join("\n");
    sender.inform(`You are carrying:\n${listing}`);
  }
}


const inventory = compose([

])(_inventory);

Object.assign(exports, {
  inventory,
});
