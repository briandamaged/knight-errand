import { Command, CommandHandler, CommandContext } from "../models";

export const CommandResolver = (
  <CMD extends Command = Command>(name: string, handler: CommandHandler<CMD>)=>
    function* resolveCommand(ctx: CommandContext<CMD>) {
      if(ctx.command.name === name) {
        yield handler;
      }
    }
)


interface CommandValidator<CMD extends Command> {
  (thing: any): thing is CMD;
}




export const Validate = (
  <CMD extends Command>(check: CommandValidator<CMD>)=>
    (next: CommandHandler<CMD>)=>
      function validate(this: any, ctx: CommandContext<Command>) {
        if(check(ctx.command)) {
          next.call(this, ctx as CommandContext<CMD>);
        } else {
          // TODO: Allow this behavior to be passed in via a callback or something
          const prettyCommand = JSON.stringify(ctx.command, null, 2);
          ctx.sender.inform(`Command validation failed:\n\n${prettyCommand}`);
        }
      }
)
