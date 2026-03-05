import { describe, it, expect } from "vitest";
import { parseTags, suggestTags } from "../parse-tags";

describe("parseTags", () => {
  it("extracts hashtag tags", () => {
    const result = parseTags("Fix bug #work #urgent");
    expect(result.tags).toEqual(["work", "urgent"]);
    expect(result.cleaned).toBe("Fix bug");
  });

  it("returns empty tags when none present", () => {
    const result = parseTags("Plain task");
    expect(result.tags).toEqual([]);
    expect(result.cleaned).toBe("Plain task");
  });
});

describe("suggestTags", () => {
  it("returns suggestions starting with input", () => {
    const suggestions = suggestTags("wo");
    expect(suggestions).toContain("work");
  });

  it("returns top 5 when no input", () => {
    const suggestions = suggestTags("");
    expect(suggestions.length).toBe(5);
  });
});
