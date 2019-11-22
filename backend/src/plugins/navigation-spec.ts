
import {expect} from 'chai';

import {
  directionMap,
  resolveNavigationInstructions,
} from './navigation';

describe('resolveNavigationInstructions', function() {



  function* createExamples() {
    for(const [direction, aliases] of Object.entries(directionMap)) {
      for(const alias of aliases) {
        for(const instruction of [alias, `go ${alias}`]) {
          yield {
            instruction: instruction,
            commands: [{
              name: "go",
              direction: direction,
            }]
          };
        }
      }
    }

    yield {
      instruction: "some unrelated instruction",
      commands: [],
    };

    yield {
      instruction: "",
      commands: [],
    };
  }


  for(const {instruction, commands} of createExamples()) {
    context(`Given ${JSON.stringify(instruction)}`, function() {
      it(`resolves with ${JSON.stringify(commands)}`, function() {
        const cmds = Array.from(resolveNavigationInstructions(instruction));
        expect(cmds).to.deep.equal(commands);
      });
    });
  }

});
