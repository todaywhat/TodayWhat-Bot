import { TodayWhatBot } from "./todaywhat-bot.js";
import express, { Express } from "express";
import { Client, GatewayIntentBits, IntentsBitField, REST, Routes } from "discord.js";
import { config } from "./utils/config.js";
import { Command } from "./commands/command.js";
import { CommandHandler } from "./events/command-handler.js";
import pingCommand from "./commands/ping-command.js";
import appstoreCommand from "./commands/appstore-command.js";
import testflightCommand from "./commands/testflight-command.js";
import currentVersionCommand from "./commands/current-version-command.js";
import { AppStoreReviewJob } from "./jobs/appstore-review-job.js";
import { Job } from "./services/job/job.js";
import { JobService } from "./services/job/job-service.js";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const commands: Command[] = [
  pingCommand,
  appstoreCommand,
  testflightCommand,
  currentVersionCommand
];

const commandHandler = new CommandHandler(commands);

const jobs: Job[] = [new AppStoreReviewJob(client)];

const jobService = new JobService(jobs);

const discordREST = new REST({ version: "10" }).setToken(config.discordToken);
const commandsJSON = commands.map((command) => command.data.toJSON());

const bot = new TodayWhatBot(config.discordToken, client, commandHandler, jobService);
await bot.start();

await discordREST.put(Routes.applicationCommands(client.user?.id ?? ""), {
  body: commandsJSON
});

const app: Express = express();
const port = 3004;

app.listen(port, () => {
  console.log(`Listening at ${port}`);
});
