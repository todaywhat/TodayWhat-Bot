import {
  ApplicationCommandOptionChoiceData,
  AutocompleteInteraction,
  CommandInteraction,
  EmbedBuilder,
  InteractionReplyOptions,
  InteractionResponse,
  InteractionUpdateOptions,
  Message,
  MessageComponentInteraction,
  ModalSubmitInteraction,
  WebhookMessageEditOptions
} from "discord.js";

export class InteractionUtils {
  public static async deferReply(
    interaction: CommandInteraction | MessageComponentInteraction | ModalSubmitInteraction,
    hidden: boolean = false
  ): Promise<InteractionResponse> {
    return await interaction.deferReply({
      ephemeral: hidden
    });
  }

  public static async deferUpdate(
    interaction: MessageComponentInteraction | ModalSubmitInteraction
  ): Promise<InteractionResponse> {
    return await interaction.deferUpdate();
  }

  public static async send(
    interaction: CommandInteraction | MessageComponentInteraction | ModalSubmitInteraction,
    content: string | EmbedBuilder | InteractionReplyOptions,
    hidden: boolean = false
  ): Promise<Message> {
    let options: InteractionReplyOptions =
      typeof content === "string"
        ? { content }
        : content instanceof EmbedBuilder
          ? { embeds: [content] }
          : content;
    if (interaction.deferred || interaction.replied) {
      return await interaction.followUp({
        ...options,
        ephemeral: hidden
      });
    } else {
      return await interaction.reply({
        ...options,
        ephemeral: hidden,
        fetchReply: true
      });
    }
  }

  public static async respond(
    interaction: AutocompleteInteraction,
    choices: ApplicationCommandOptionChoiceData[] = []
  ): Promise<void> {
    return await interaction.respond(choices);
  }

  public static async editReply(
    interaction: CommandInteraction | MessageComponentInteraction | ModalSubmitInteraction,
    content: string | EmbedBuilder | WebhookMessageEditOptions
  ): Promise<Message> {
    let options: WebhookMessageEditOptions =
      typeof content === "string"
        ? { content }
        : content instanceof EmbedBuilder
          ? { embeds: [content] }
          : content;
    return await interaction.editReply(options);
  }

  public static async update(
    interaction: MessageComponentInteraction,
    content: string | EmbedBuilder | InteractionUpdateOptions
  ): Promise<Message> {
    let options: InteractionUpdateOptions =
      typeof content === "string"
        ? { content }
        : content instanceof EmbedBuilder
          ? { embeds: [content] }
          : content;
    return await interaction.update({
      ...options,
      fetchReply: true
    });
  }
}
