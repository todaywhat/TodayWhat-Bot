import {
  ApplicationCommandOptionChoiceData,
  AutocompleteFocusedOption,
  AutocompleteInteraction,
  CommandInteraction,
  SlashCommandBuilder
} from "discord.js";

export interface Command {
  data: SlashCommandBuilder;
  deferType: CommandDeferType;
  autocomplete?(
    interaction: AutocompleteInteraction,
    option: AutocompleteFocusedOption
  ): Promise<ApplicationCommandOptionChoiceData[]>;
  execute(interaction: CommandInteraction): Promise<void>;
}

export enum CommandDeferType {
  PUBLIC = "PUBLIC",
  HIDDEN = "HIDDEN",
  NONE = "NONE"
}
