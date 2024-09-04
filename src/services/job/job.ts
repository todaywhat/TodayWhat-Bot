export abstract class Job {
  abstract name: string;
  abstract schedule: string;
  runOnce = false;
  initialDelaySecond = 0;
  abstract run(): Promise<void>;
}
