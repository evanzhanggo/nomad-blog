import { describe, expect, it } from "vitest";
import { buildDraft } from "../src/item";
import { MIN_QUALITY_SCORE, scoreQuality } from "../src/score";

const guide = "字".repeat(160);

describe("scoreQuality", () => {
  it("keeps a practical ITIN guide and a Hong Kong account guide", () => {
    const itin = scoreQuality("ITIN 美国税号申请教程：4 种方式横评", guide);
    expect(itin.rejected).toBe(false);
    expect(itin.topic).toBe("tax");
    expect(itin.score).toBeGreaterThanOrEqual(MIN_QUALITY_SCORE);

    const bank = scoreQuality("汇丰香港港卡开户教程", guide);
    expect(bank.topic).toBe("bank");
    expect(bank.score).toBeGreaterThanOrEqual(MIN_QUALITY_SCORE);
  });

  it("rejects job ads and chatter", () => {
    expect(scoreQuality("招一位远程全栈，内推岗位", guide).rejected).toBe(true);
    expect(scoreQuality("工作久了，休息的时候各位都在做些啥", "随便聊聊").score).toBeLessThan(MIN_QUALITY_SCORE);
    expect(
      buildDraft({
        url: "https://eleduck.com/posts/job",
        title: "【远程】软件测试工程师招聘",
        excerpt: guide,
        sourceId: "eleduck",
        sourceName: "电鸭社区",
      }),
    ).toBeNull();
  });

  it("drops a short off-topic note even if it is Chinese", () => {
    const quality = scoreQuality("今天天气不错", "出门走走");
    expect(quality.topic).toBe("");
    expect(quality.score).toBeLessThan(MIN_QUALITY_SCORE);
  });
});
