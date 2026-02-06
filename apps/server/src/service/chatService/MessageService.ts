import { createClient } from "redis";

type RedisClient = ReturnType<typeof createClient>;

export class MessageService<T> {
  constructor(
    private readonly redis: RedisClient,
    private readonly chatKey: string,
    private readonly maxHistory: number
  ) {}

  async saveMessage(chatData: T): Promise<void> {
    try {
      await this.redis
        .multi()
        .rPush(this.chatKey, JSON.stringify(chatData))
        .lTrim(this.chatKey, -this.maxHistory, -1)
        .exec();
    } catch (error) {
      console.error(`MessageService 저장 실패 (Key: ${this.chatKey}):`, error);
    }
  }

  async loadMessageHistory(): Promise<T[]> {
    try {
      const rawData = await this.redis.lRange(this.chatKey, 0, -1);
      return rawData?.map((item: string) => JSON.parse(item)) || [];
    } catch (error) {
      console.error("조회 실패:", error);
      return [];
    }
  }
}
