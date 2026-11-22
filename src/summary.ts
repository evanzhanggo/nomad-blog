import { visibleText } from "./content";
import { plainTitle } from "./text";

/** Current Workers AI Qwen instruct model. qwen2.5-7b-instruct is not in the catalog. */
export const SUMMARY_MODEL = "@cf/qwen/qwen3-30b-a3b-fp8";

const INPUT_CHARS = 6_000;

export function summaryInput(title: string, contentHtml: string | null | undefined, excerpt: string): string {
  const body = contentHtml ? visibleText(contentHtml) : excerpt;
  const clipped = Array.from(body).slice(0, INPUT_CHARS).join("");
  return `标题：${title}\n\n正文：${clipped}`;
}

export function readModelText(result: unknown): string {
  if (typeof result === "string") return result;
  if (!result || typeof result !== "object") return "";
  const record = result as Record<string, unknown>;
  if (typeof record.response === "string") return record.response;
  const choices = record.choices;
  if (!Array.isArray(choices) || !choices.length) return "";
  const message = (choices[0] as { message?: { content?: unknown } }).message;
  return typeof message?.content === "string" ? message.content : "";
}

/** Plain 简体中文 summary, or null when the model output is not usable. */
export function cleanSummary(raw: string): string | null {
  let text = raw.replace(/<think>[\s\S]*?<\/think>/gi, " ");
  text = text.replace(/^[\s\S]*?<\/think>/i, " ");
  text = plainTitle(text);
  text = text.replace(/^(摘要|总结|AI摘要|简体中文摘要|以下是(?:摘要|总结)?)[:：]\s*/i, "");
  text = text.replace(/^["“「]|["”」]$/g, "").trim();
  text = text.replace(/\s+/g, " ").trim();
  if (text.length < 20 || text.startsWith("标题：")) return null;
  const chars = Array.from(text);
  if (chars.length > 160) {
    const cut = chars.slice(0, 150).join("");
    const end = Math.max(cut.lastIndexOf("。"), cut.lastIndexOf("！"), cut.lastIndexOf("？"));
    text = (end >= 40 ? cut.slice(0, end + 1) : `${cut.trimEnd()}…`).trim();
  }
  return text || null;
}

export async function summarizeArticle(
  ai: Ai | undefined,
  title: string,
  contentHtml: string | null | undefined,
  excerpt: string,
): Promise<string | null> {
  if (!ai) return null;
  const source = summaryInput(title, contentHtml, excerpt);
  if (Array.from(source).length < 40) return null;
  try {
    const result = await ai.run(SUMMARY_MODEL, {
      messages: [
        {
          role: "system",
          content:
            "你是中文编辑。只输出两到三句简体中文摘要，大约80到150个字。不要标题、前言、编号、引号或英文说明。",
        },
        { role: "user", content: source },
      ],
      max_tokens: 256,
      temperature: 0.2,
    });
    return cleanSummary(readModelText(result));
  } catch (error) {
    console.error("summary failed", error instanceof Error ? error.message : error);
    return null;
  }
}
