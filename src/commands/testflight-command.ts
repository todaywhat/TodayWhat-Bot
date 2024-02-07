import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { Command, CommandDeferType } from "./index.js";
import axios, { AxiosRequestConfig } from "axios";
import { config } from "../utils/config.js";
import { InteractionUtils } from "../utils/index.js";

export default {
  data: new SlashCommandBuilder()
    .setName("테플")
    .setDescription("테스트플라이트에 앱을 업로드하기위한 위한 명령어에요!")
    .addStringOption((optionBuilder) =>
      optionBuilder
        .setName("버전")
        .setDescription("테스트플라이트에 올릴 앱의 버전을 입력해주세요!")
        .setRequired(true)
    )
    .addStringOption((optionBuilder) =>
      optionBuilder
        .setName("플랫폼")
        .setDescription("제출함 플랫폼을 선택해주세요!")
        .addChoices({ name: "ios", value: "ios" }, { name: "mac", value: "mac" })
        .setRequired(true)
    ),
  deferType: CommandDeferType.NONE,
  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const inputVersion = interaction.options.getString("버전");
    const inputPlatform: "ios" | "mac" = interaction.options.getString("플랫폼") as "ios" | "mac";

    const requestJSON = {
      ref: "master",
      inputs: {
        platform: inputPlatform,
        version: inputVersion
      }
    };
    const requestConfig: AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${config.githubToken}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28"
      }
    };

    const response = await axios.post(
      "https://api.github.com/repos/baekteun/TodayWhat-new/actions/workflows/85097586/dispatches",
      requestJSON,
      requestConfig
    );

    let content: string;
    if (response.status >= 200 && response.status < 300) {
      content = `
- 플랫폼: ${inputPlatform}
- 버전: ${inputVersion}

🚀 테스트플라이트에 앱 업로드를 시작합니다.. 조금만 기다려주세요..!
      `;
    } else {
      content = `
😵 테스트플라이트 업로드가 실패했습니다..

reason: ${response.data}
      `;
    }
    await InteractionUtils.send(interaction, content);
  }
} as Command;
