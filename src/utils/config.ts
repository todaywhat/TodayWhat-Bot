import "dotenv/config";

interface Config {
  discordToken: string;
}

export const config: Config = {
  discordToken: process.env.DISCORD_TOKEN ?? ""
};
