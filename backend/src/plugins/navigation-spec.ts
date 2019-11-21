
import {expect} from 'chai';

import {
  resolveNavigationInstructions,
} from './navigation';

describe('resolveNavigationInstructions', function() {

  function DIRECTION_EXAMPLES(direction: string) {
    return [
      {
        instruction: `go ${direction}`,
        commands: [{
          name: "go",
          direction: direction,
        }],
      },
      {
        instruction: direction[0],
        commands: [{
          name: "go",
          direction: direction,
        }],
      },
      {
        instruction: direction,
        commands: [{
          name: "go",
          direction: direction,
        }],
      },      
    ];
  }

  const examples = [
    ...DIRECTION_EXAMPLES("north"),
    ...DIRECTION_EXAMPLES("south"),
  ];


  for(const {instruction, commands} of examples) {
    context(`Given ${JSON.stringify(instruction)}`, function() {
      it(`resolves with ${JSON.stringify(commands)}`, function() {
        const cmds = Array.from(resolveNavigationInstructions(instruction));
        expect(cmds).to.deep.equal(commands);
      });
    });
  }

});
