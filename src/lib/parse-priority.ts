import { Priority } from "./types";

const PRIORITY_PATTERNS: { pattern: RegExp; priority: Priority }[] = [
  { pattern: /(?:!!!+\s*urgent|\bp0\b|\bcritical\b)/i, priority: "P0" },
  { pattern: /(?:!!+\s*important|\bp1\b|\bhigh\b)/i, priority: "P1" },
  { pattern: /(?:!\s*medium|\bp2\b|\bmedium\b)/i, priority: "P2" },
  { pattern: /(?:\bp3\b|\blow\b)/i, priority: "P3" },
];

export function parsePriority(text: string): { priority: Priority; cleaned: string } {
  for (const { pattern, priority } of PRIORITY_PATTERNS) {
    if (pattern.test(text)) {
      return {
        priority,
        cleaned: text.replace(pattern, "").trim(),
      };
    }
  }
  return { priority: "P2", cleaned: text };
}
