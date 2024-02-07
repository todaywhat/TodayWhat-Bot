import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { Command, CommandDeferType } from "./index.js";
import { InteractionUtils } from "../utils/index.js";
import axios from "axios";
import plist from "plist";

export default {
  data: new SlashCommandBuilder()
    .setName("버전")
    .setDescription("오늘뭐임 iOS, macOS앱의 버전을 갖고 와요"),
  deferType: CommandDeferType.NONE,
  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const iosInfoPlistString = await axios.get(
      "https://raw.githubusercontent.com/baekteun/TodayWhat-new/master/Projects/App/iOS/Support/Info.plist"
    );
    const macosInfoPlistString = await axios.get(
      "https://raw.githubusercontent.com/baekteun/TodayWhat-new/master/Projects/App/macOS/Support/Info.plist"
    );

    const iosInfoPlist: any = plist.parse(iosInfoPlistString.data);
    const macosInfoPlist: any = plist.parse(macosInfoPlistString.data);

    const embeds = new EmbedBuilder()
      .setTitle("오늘뭐임 iOS, macOS 버전")
      .setDescription("깃허브를 기준으로 현재 오늘뭐임의 iOS, macOS 버전을 가져와요.")
      .addFields(
        { name: "iOS", value: iosInfoPlist.CFBundleShortVersionString },
        { name: "macOS", value: macosInfoPlist.CFBundleShortVersionString }
      );

    await InteractionUtils.send(interaction, embeds);
  }
} as Command;
