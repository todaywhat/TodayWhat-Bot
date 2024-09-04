import "dotenv/config";

interface Config {
  discordToken: string;
  githubToken: string;
  reviewChannelID: string;
}

export const config: Config = {
  discordToken: process.env.DISCORD_TOKEN ?? "",
  githubToken: process.env.GITHUB_TOKEN ?? "",
  reviewChannelID: process.env.REVIEW_CHANNEL_ID ?? ""
};
