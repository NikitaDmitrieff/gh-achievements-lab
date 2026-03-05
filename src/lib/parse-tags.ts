export function parseTags(text: string): { tags: string[]; cleaned: string } {
  const tagPattern = /#(\w+)/g;
  const tags: string[] = [];
  let match;

  while ((match = tagPattern.exec(text)) !== null) {
    tags.push(match[1]);
  }

  const cleaned = text.replace(/#\w+/g, "").trim();
  return { tags, cleaned };
}

const SUGGESTED_TAGS = [
  "work",
  "personal",
  "health",
  "finance",
  "learning",
  "project",
  "meeting",
  "followup",
  "idea",
  "bug",
  "feature",
  "design",
  "review",
];

export function suggestTags(input: string): string[] {
  if (!input) return SUGGESTED_TAGS.slice(0, 5);
  const lower = input.toLowerCase();
  return SUGGESTED_TAGS.filter((t) => t.startsWith(lower));
}
