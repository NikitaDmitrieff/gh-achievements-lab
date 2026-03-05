import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  formatDate,
  formatRelativeDate,
  slugify,
  truncate,
  generateId,
  groupBy,
  paginate,
} from "@/lib/utils";

describe("formatDate", () => {
  it("formats a date in en-US short format", () => {
    const date = new Date("2025-01-15T10:00:00Z");
    const result = formatDate(date);
    expect(result).toMatch(/Jan\s+15,\s+2025/);
  });

  it("handles different months", () => {
    const date = new Date("2025-06-01T00:00:00Z");
    const result = formatDate(date);
    expect(result).toMatch(/Jun/);
  });
});

describe("formatRelativeDate", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-01-15T12:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns 'just now' for dates less than a minute ago", () => {
    const date = new Date("2025-01-15T11:59:30Z");
    expect(formatRelativeDate(date)).toBe("just now");
  });

  it("returns minutes ago for dates less than an hour ago", () => {
    const date = new Date("2025-01-15T11:45:00Z");
    expect(formatRelativeDate(date)).toBe("15m ago");
  });

  it("returns hours ago for dates less than a day ago", () => {
    const date = new Date("2025-01-15T09:00:00Z");
    expect(formatRelativeDate(date)).toBe("3h ago");
  });

  it("returns days ago for dates less than a week ago", () => {
    const date = new Date("2025-01-13T12:00:00Z");
    expect(formatRelativeDate(date)).toBe("2d ago");
  });

  it("returns formatted date for dates more than a week ago", () => {
    const date = new Date("2025-01-01T12:00:00Z");
    const result = formatRelativeDate(date);
    expect(result).toMatch(/Jan/);
    expect(result).not.toContain("ago");
  });
});

describe("slugify", () => {
  it("converts text to lowercase kebab-case", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("removes special characters", () => {
    expect(slugify("Hello! World?")).toBe("hello-world");
  });

  it("replaces multiple spaces with single dash", () => {
    expect(slugify("hello   world")).toBe("hello-world");
  });

  it("trims whitespace", () => {
    expect(slugify("  hello world  ")).toBe("hello-world");
  });

  it("handles underscores", () => {
    expect(slugify("hello_world_test")).toBe("hello-world-test");
  });

  it("collapses multiple dashes", () => {
    expect(slugify("hello---world")).toBe("hello-world");
  });

  it("handles empty string", () => {
    expect(slugify("")).toBe("");
  });
});

describe("truncate", () => {
  it("returns original text if shorter than max", () => {
    expect(truncate("hello", 10)).toBe("hello");
  });

  it("returns original text if equal to max", () => {
    expect(truncate("hello", 5)).toBe("hello");
  });

  it("truncates with ellipsis when text exceeds max", () => {
    expect(truncate("hello world", 8)).toBe("hello...");
  });

  it("handles very short max length", () => {
    expect(truncate("hello", 4)).toBe("h...");
  });
});

describe("generateId", () => {
  it("returns a string", () => {
    expect(typeof generateId()).toBe("string");
  });

  it("generates unique IDs", () => {
    const ids = new Set(Array.from({ length: 100 }, () => generateId()));
    expect(ids.size).toBe(100);
  });

  it("returns a UUID format", () => {
    const id = generateId();
    expect(id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
    );
  });
});

describe("groupBy", () => {
  it("groups items by a key", () => {
    const items = [
      { status: "todo", title: "A" },
      { status: "done", title: "B" },
      { status: "todo", title: "C" },
    ];
    const grouped = groupBy(items, "status");
    expect(grouped.todo).toHaveLength(2);
    expect(grouped.done).toHaveLength(1);
  });

  it("returns empty object for empty array", () => {
    expect(groupBy([], "id")).toEqual({});
  });

  it("creates single-item groups when all keys are unique", () => {
    const items = [
      { id: "1", name: "A" },
      { id: "2", name: "B" },
    ];
    const grouped = groupBy(items, "id");
    expect(Object.keys(grouped)).toHaveLength(2);
    expect(grouped["1"]).toHaveLength(1);
  });
});

describe("paginate", () => {
  const items = Array.from({ length: 25 }, (_, i) => ({ id: i + 1 }));

  it("returns correct page of data", () => {
    const result = paginate(items, 1, 10);
    expect(result.data).toHaveLength(10);
    expect(result.data[0].id).toBe(1);
  });

  it("returns correct second page", () => {
    const result = paginate(items, 2, 10);
    expect(result.data).toHaveLength(10);
    expect(result.data[0].id).toBe(11);
  });

  it("returns partial last page", () => {
    const result = paginate(items, 3, 10);
    expect(result.data).toHaveLength(5);
    expect(result.data[0].id).toBe(21);
  });

  it("returns correct metadata", () => {
    const result = paginate(items, 1, 10);
    expect(result.total).toBe(25);
    expect(result.page).toBe(1);
    expect(result.limit).toBe(10);
    expect(result.totalPages).toBe(3);
  });

  it("returns empty data for page beyond total", () => {
    const result = paginate(items, 10, 10);
    expect(result.data).toHaveLength(0);
  });

  it("handles single item", () => {
    const result = paginate([{ id: 1 }], 1, 10);
    expect(result.data).toHaveLength(1);
    expect(result.totalPages).toBe(1);
  });

  it("handles empty array", () => {
    const result = paginate([], 1, 10);
    expect(result.data).toHaveLength(0);
    expect(result.total).toBe(0);
    expect(result.totalPages).toBe(0);
  });
});
