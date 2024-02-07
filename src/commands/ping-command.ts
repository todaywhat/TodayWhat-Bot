import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { Command, CommandDeferType } from "./index.js";
import { InteractionUtils } from "../utils/index.js";

export default {
  data: new SlashCommandBuilder().setName("ping").setDescription("생존 신고!"),
  deferType: CommandDeferType.NONE,
  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    await InteractionUtils.send(interaction, "I'm.. still.. alive..!");
  }
} as Command;
