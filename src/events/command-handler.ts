import { AutocompleteInteraction, CommandInteraction } from "discord.js";
import { EventHandler } from "./index.js";
import { Command, CommandDeferType } from "../commands/index.js";
import { CommandUtils, InteractionUtils } from "../utils/index.js";
import { DiscordLimits } from "../constants/discord-limits.js";

export class CommandHandler implements EventHandler {
  constructor(public commands: Command[]) {}

  public async process(interaction: CommandInteraction | AutocompleteInteraction): Promise<void> {
    if (interaction.user.id === interaction.client.user?.id || interaction.user.bot) {
      return;
    }

    let commandName = interaction.commandName;

    let command = CommandUtils.findCommand(this.commands, commandName);
    if (!command) {
      console.log(`command not found ${commandName}`);
      return;
    }

    if (interaction instanceof AutocompleteInteraction) {
      if (!command.autocomplete) {
        console.log(`auto complete not found ${commandName}`);
        return;
      }

      try {
        let option = interaction.options.getFocused(true);
        let choices = await command.autocomplete(interaction, option);
        await InteractionUtils.respond(
          interaction,
          choices?.slice(0, DiscordLimits.CHOICES_PER_AUTOCOMPLETE)
        );
      } catch (error) {
        console.log(error);
      }
      return;
    }

    switch (command.deferType) {
      case CommandDeferType.PUBLIC: {
        await InteractionUtils.deferReply(interaction, false);
        break;
      }
      case CommandDeferType.HIDDEN: {
        await InteractionUtils.deferReply(interaction, true);
        break;
      }
    }

    if (command.deferType !== CommandDeferType.NONE && !interaction.deferred) {
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      await this.sendError(interaction);
      console.log(error);
    }
  }

  private async sendError(interaction: CommandInteraction): Promise<void> {
    await InteractionUtils.send(interaction, "Something went wrong!");
  }
}
