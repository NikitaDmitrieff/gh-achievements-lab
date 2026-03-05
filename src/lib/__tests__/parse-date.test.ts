import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { parseDate } from "../parse-date";

describe("parseDate", () => {
  beforeEach(() => {
    // Fix date to Wednesday, 2026-03-04
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 2, 4));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("parses 'today'", () => {
    const result = parseDate("Buy milk today");
    expect(result.date).toEqual(new Date(2026, 2, 4));
    expect(result.cleaned).toBe("Buy milk");
  });

  it("parses 'tomorrow'", () => {
    const result = parseDate("Call dentist tomorrow");
    expect(result.date).toEqual(new Date(2026, 2, 5));
    expect(result.cleaned).toBe("Call dentist");
  });

  it("parses 'next friday'", () => {
    const result = parseDate("Submit report next friday");
    expect(result.date).not.toBeNull();
    expect(result.date!.getDay()).toBe(5); // Friday
    expect(result.cleaned).toBe("Submit report");
  });

  it("parses 'in 3 days'", () => {
    const result = parseDate("Follow up in 3 days");
    expect(result.date).toEqual(new Date(2026, 2, 7));
    expect(result.cleaned).toBe("Follow up");
  });

  it("parses bare weekday name", () => {
    const result = parseDate("Team standup monday");
    expect(result.date).not.toBeNull();
    expect(result.date!.getDay()).toBe(1); // Monday
    expect(result.cleaned).toBe("Team standup");
  });

  it("returns null date when no date expression found", () => {
    const result = parseDate("Just a regular task");
    expect(result.date).toBeNull();
    expect(result.cleaned).toBe("Just a regular task");
  });
});
