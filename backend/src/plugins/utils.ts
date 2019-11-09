import { Command, CommandHandler, CommandContext } from "../models";

export const CommandResolver = (
  <CMD extends Command = Command>(name: string, handler: CommandHandler<CMD>)=>
    function* resolveCommand(ctx: CommandContext<CMD>) {
      if(ctx.command.name === name) {
        yield handler;
      }
    }
)

