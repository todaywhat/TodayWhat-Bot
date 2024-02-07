import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { Command, CommandDeferType } from "./index.js";
import axios, { AxiosRequestConfig } from "axios";
import { config } from "../utils/config.js";
import { InteractionUtils } from "../utils/interaction-util.js";

export default {
  data: new SlashCommandBuilder()
    .setName("앱스토어")
    .setDescription("앱스토어에 심사를 올리기 위한 명령어에요!")
    .addStringOption((optionBuilder) =>
      optionBuilder
        .setName("버전")
        .setDescription("심사를 올릴 앱의 버전을 입력해주세요!")
        .setRequired(true)
    )
    .addStringOption((optionBuilder) =>
      optionBuilder
        .setName("플랫폼")
        .setDescription("제출함 플랫폼을 선택해주세요!")
        .addChoices({ name: "ios", value: "ios" }, { name: "mac", value: "mac" })
        .setRequired(true)
    )
    .addStringOption((optionBuilder) =>
      optionBuilder
        .setName("변경사항")
        .setDescription("이번 버전에서 변경된 사항을 입력해주세요! \\n은 줄바꿈으로 변환됩니다!")
        .setRequired(false)
    )
    .addAttachmentOption((optionBuilder) =>
      optionBuilder
        .setName("변경사항파일")
        .setDescription("변경사항이 너무 길다면 파일을 텍스트 파일을 업로드해주세요!")
        .setRequired(false)
    ),
  deferType: CommandDeferType.NONE,
  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const inputVersion = interaction.options.getString("버전");
    const inputPlatform: "ios" | "mac" = interaction.options.getString("플랫폼") as "ios" | "mac";

    const inputChangedFile = interaction.options.getAttachment("변경사항파일");

    const inputChanged: string | undefined = inputChangedFile
      ? (await axios.get(inputChangedFile.url)).data
      : interaction.options.getString("변경사항")?.replaceAll("\\n", "\n");

    if (!inputChanged) {
      await InteractionUtils.send(interaction, "변경사항을 입력 혹은 파일로 업로드해주세요!");
      return;
    }

    const requestJSON = {
      ref: "master",
      inputs: {
        platform: inputPlatform,
        version: inputVersion,
        changed: inputChanged
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
      "https://api.github.com/repos/baekteun/TodayWhat-new/actions/workflows/85097585",
      requestJSON,
      requestConfig
    );

    let content: string;
    if (response.status >= 200 && response.status < 300) {
      content = `
- 플랫폼: ${inputPlatform}
- 버전: ${inputVersion}
- 변경사항: ${inputChanged}
      
🚀 앱스토어에 앱 제출을 시작합니다.. 조금만 기다려주세요..!
      `;
    } else {
      content = `
😵 앱스토어 배포 자동화가 실패했습니다..

reason: ${response.data}
      `;
    }
    await InteractionUtils.send(interaction, content);
  }
} as Command;
