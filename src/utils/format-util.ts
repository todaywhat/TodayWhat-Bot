import { ApplicationCommand, Guild } from "discord.js";
import { filesize } from "filesize";

export class FormatUtils {
  public static roleMention(guild: Guild, discordId: string): string {
    if (discordId === "@here") {
      return discordId;
    }

    if (discordId === guild.id) {
      return "@everyone";
    }

    return `<@&${discordId}>`;
  }

  public static channelMention(discordId: string): string {
    return `<#${discordId}>`;
  }

  public static userMention(discordId: string): string {
    return `<@!${discordId}>`;
  }

  public static commandMention(command: ApplicationCommand, subParts: string[] = []): string {
    let name = [command.name, ...subParts].join(" ");
    return `</${name}:${command.id}>`;
  }

  public static fileSize(bytes: number): string {
    return filesize(bytes, { output: "string", pad: true, round: 2 });
  }
}
