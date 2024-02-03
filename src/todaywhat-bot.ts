import {
  AutocompleteInteraction,
  Client,
  CommandInteraction,
  Events,
  Interaction
} from "discord.js";
import { CommandHandler } from "./events/command-handler";

export class TodayWhatBot {
  private isReady = false;

  constructor(
    private token: string,
    private client: Client,
    private commandHandler: CommandHandler
  ) {}

  public async start() {
    this.registerListeners();
    await this.login(this.token);
  }

  private registerListeners() {
    this.client.on(Events.ClientReady, () => {
      this.onReady();
    });

    this.client.on(Events.InteractionCreate, (interaction: Interaction) => {
      this.onInteraction(interaction);
    });
  }

  private async login(token: string) {
    await this.client.login(token);
  }

  private async onReady() {
    this.isReady = true;
    console.log("오늘뭐임 iOS 봇 시작");
  }

  private async onInteraction(interaction: Interaction) {
    if (!this.isReady) {
      return;
    }

    const isCommandInteraction =
      interaction instanceof CommandInteraction || interaction instanceof AutocompleteInteraction;

    if (!isCommandInteraction) {
      return;
    }

    await this.commandHandler.process(interaction);
  }
}
