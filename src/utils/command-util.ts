import { Command } from "../commands/index.js";

export class CommandUtils {
  public static findCommand(commands: Command[], commandName: string): Command | undefined {
    return commands.find((command) => command.data.name == commandName);
  }
}
