
const {compose} = require('redecor8');



function resolve({sender, target}) {
  if(!target || target.length === 0) {
    return sender.location;
  }
}


function look({sender, target}) {
  sender.inform(describe({
    sender, target,
  }));
}



function _describe({sender, target}) {
  return target.description;
}


const resolveTarget = (
  (next)=>
    function({sender, target}) {
      return next({
        sender: sender,
        target: resolve({sender, target}),
      })
    }
);


const handleUnresolvedTarget = (
  (next)=>
    function({sender, target}) {
      if(!target) {
        return "Are you sure there is one of those nearby?";
      }

      return next({sender, target});
    }
);

const handleBlindness = (
  (next)=>
    function({sender, target}) {
      if(sender.blind) {
        return "You can't see anything.  You're blind.";
      }

      return next({sender, target});
    }
);

const describe = compose([
  resolveTarget,
  handleUnresolvedTarget,
  handleBlindness,
])(_describe);


Object.assign(exports, {
  look,
  describe,
});
