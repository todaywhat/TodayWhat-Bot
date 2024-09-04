import parser from "cron-parser";
import { DateTime } from "luxon";
import schedule from "node-schedule";
import { Job } from "./job.js";

export class JobService {
  constructor(private jobs: Job[]) {}

  async start() {
    for (const job of this.jobs) {
      const jobSchedule = job.runOnce
        ? parser
            .parseExpression(job.schedule.toString(), {
              currentDate: DateTime.now()
                .setZone("Asia/Seoul")
                .plus({ seconds: job.initialDelaySecond })
                .toJSDate()
            })
            .next()
            .toDate()
        : {
            start: DateTime.now()
              .setZone("Asia/Seoul")
              .plus({ seconds: job.initialDelaySecond })
              .toJSDate(),
            rule: job.schedule,
            tz: "Asia/Seoul"
          };

      schedule.scheduleJob(jobSchedule, async () => {
        await job.run();
      });
    }
  }
}
