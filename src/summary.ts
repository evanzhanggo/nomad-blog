import { visibleText } from "./content";
import { plainTitle } from "./text";

/** Verified in production. qwen3-30b-a3b-fp8 was deprecated on 2026-11-20. */
export const SUMMARY_MODEL = "@cf/meta/llama-3.3-70b-instruct-fp8-fast";

const INPUT_CHARS = 6_000;

export function summaryInput(title: string, contentHtml: string | null | undefined, excerpt: string): string {
  const body = contentHtml ? visibleText(contentHtml) : excerpt;
  const clipped = Array.from(body).slice(0, INPUT_CHARS).join("");
  return `标题：${title}\n\n正文：${clipped}`;
}

/** Drop closed think blocks and an unclosed `<think>...` tail. */
export function stripThink(raw: string): string {
  return raw
    .replace(/<think>[\s\S]*?<\/think>/gi, " ")
    .replace(/^[\s\S]*?<\/think>/i, " ")
    .replace(/<think>[\s\S]*$/gi, "");
}

export function readModelText(result: unknown): string {
  let text = "";
  if (typeof result === "string") text = result;
  else if (result && typeof result === "object") {
    const record = result as Record<string, unknown>;
    if (typeof record.response === "string") text = record.response;
    else if (Array.isArray(record.choices) && record.choices.length) {
      const message = (record.choices[0] as { message?: { content?: unknown } }).message;
      if (typeof message?.content === "string") text = message.content;
    }
  }
  return stripThink(text);
}

/** Plain 简体中文 summary, or null when the model output is not usable. */
export function cleanSummary(raw: string): string | null {
  let text = plainTitle(stripThink(raw));
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
): Promise<{ text: string | null; error: string | null }> {
  if (!ai) return { text: null, error: null };
  const source = summaryInput(title, contentHtml, excerpt);
  if (Array.from(source).length < 40) return { text: null, error: null };
  try {
    const result = await ai.run(SUMMARY_MODEL, {
      messages: [
        {
          role: "system",
          content:
            "你是中文编辑。原文即使是繁体中文，也必须改写成简体中文。只输出两到三句简体中文摘要，大约80到150个字。不要标题、前言、编号、引号、英文说明或繁体字。",
        },
        { role: "user", content: source },
      ],
      max_tokens: 1024,
      temperature: 0.2,
    });
    return { text: cleanSummary(readModelText(result)), error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("summary failed", message);
    return { text: null, error: message };
  }
}
