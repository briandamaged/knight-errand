
const {compose} = require('redecor8');



function resolve({sender, target}) {
  if(Array.isArray(target)) {
    target = target[0];
  }

  return sender.inventory.find((item)=> item.name === target);
}



function _eat({sender, target}) {
  if(sender.eat) {
    sender.eat(target);
  }

  if(target.beEatenBy) {
    target.beEatenBy(sender);
  }
}


const handleBlindness = (
  (next)=>
    function({sender, target}) {
      if(sender.blind) {
        sender.inform("Well, maybe you would if you could FREAKIN' SEE ANYTHING!!!");
        return;
      }

      return next({sender, target});
    }
)



const resolveTarget = (
  (next)=>
    function({sender, target}) {
      return next({
        sender: sender,
        target: resolve({sender, target}),
      });
    }
)

const handleUnresolvedTarget = (
  (next)=>
    function({sender, target}) {
      if(target) {
        return next({sender, target});
      }

      sender.inform("Well, maybe you would if you knew what that was.")
    }
)


const eat = compose([
  handleBlindness,
  resolveTarget,
  handleUnresolvedTarget,
])(_eat);

Object.assign(exports, {
  eat,
});
