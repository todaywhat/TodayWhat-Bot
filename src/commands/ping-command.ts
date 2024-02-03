import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { Command, CommandDeferType } from "./index.js";
import { InteractionUtils } from "../utils/interaction-util.js";

export default {
  data: new SlashCommandBuilder().setName("ping").setDescription("생존 신고!"),
  deferType: CommandDeferType.PUBLIC,
  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    InteractionUtils.send(interaction, "I'm.. still.. alive..!");
  }
} as Command;
