import { DateTime } from "luxon";
import { Job } from "../services/job/job.js";
import axios from "axios";
import { readJsonFile, writeJsonKeyValue } from "../utils/json-util.js";
import { Client, EmbedBuilder, TextChannel } from "discord.js";
import { config } from "../utils/config.js";

interface ReviewEntry {
  id: AppStoreLabel;
  title: AppStoreLabel;
  content: AppStoreLabel;
  "im:rating": AppStoreLabel;
  "im:version": AppStoreLabel;
  updated: AppStoreLabel;
  author: ReviewAuthor;
}

interface ReviewAuthor {
  name: AppStoreLabel;
}

interface AppStoreLabel {
  label: string;
}

const latestReviewIDJSONFilePath = "reviews/review.json";
const latestReviewIDKey = "latestReviewID";

export class AppStoreReviewJob extends Job {
  name: string = "app-store-review-job";
  schedule: string = "0 * * * *";
  initialDelaySecond = 60 - DateTime.now().setZone("Asia/Seoul").second;

  constructor(private readonly client: Client) {
    super();
  }

  async run(): Promise<void> {
    try {
      const allReviews = await this.fetchAppStoreReviews();
      const latestReviewID: string | null = readJsonFile(
        latestReviewIDJSONFilePath,
        latestReviewIDKey
      );
      let newReviews: ReviewEntry[];
      if (latestReviewID) {
        newReviews = this.newReviews(latestReviewID, allReviews);
      } else {
        newReviews = allReviews;
      }

      if (newReviews.length === 0) {
        console.log("No new reviews");
        return;
      }

      const channel = (await this.client.channels.fetch(config.reviewChannelID)) as
        | TextChannel
        | undefined;

      if (!channel) {
        console.log("Failed to find channel");
        return;
      }

      const newLatestReviewID = newReviews[0].id.label;
      writeJsonKeyValue(latestReviewIDJSONFilePath, latestReviewIDKey, newLatestReviewID);

      for (const review of newReviews.reverse()) {
        const embed = this.makeReviewEmbed(review);
        await channel.send({ embeds: [embed] });
      }
    } catch (error) {
      console.error("Error checking for new reviews:", error);
    }
  }

  private async fetchAppStoreReviews(): Promise<ReviewEntry[]> {
    const url = `https://itunes.apple.com/kr/rss/customerreviews/id=1629567018/sortBy=mostRecent/json`;
    const response = await axios.get(url);

    return response.data.feed.entry;
  }

  private newReviews(latestReviewID: string | null, reviews: ReviewEntry[]): ReviewEntry[] {
    if (!latestReviewID) {
      return reviews;
    }

    const latestReviewIndex = reviews.findIndex((review) => review.id.label === latestReviewID);

    if (latestReviewIndex === -1) {
      return reviews;
    }

    return reviews.slice(0, latestReviewIndex);
  }

  private makeReviewEmbed(review: ReviewEntry): EmbedBuilder {
    const ratingStars = "⭐".repeat(Number(review["im:rating"].label));
    const updatedDate = DateTime.fromISO(review.updated.label).toFormat("yyyy-MM-dd HH:mm:ss");

    return new EmbedBuilder()
      .setColor("#0099ff")
      .setTitle("신규 iOS 앱스토어 리뷰")
      .addFields(
        { name: "별점", value: `${ratingStars} (${review["im:rating"].label})`, inline: true },
        { name: "버전", value: review["im:version"].label, inline: true },
        { name: "작성자", value: review.author.name.label, inline: true },
        { name: "제목", value: review.title.label },
        { name: "내용", value: review.content.label },
        { name: "작성일자", value: updatedDate }
      )
      .setFooter({ text: "App Store Review" })
      .setTimestamp();
  }
}
