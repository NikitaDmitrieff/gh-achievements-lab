import { describe, it, expect } from "vitest";
import { parsePriority } from "../parse-priority";

describe("parsePriority", () => {
  it("detects P0 from '!!! urgent'", () => {
    const result = parsePriority("Fix server !!! urgent");
    expect(result.priority).toBe("P0");
    expect(result.cleaned).toBe("Fix server");
  });

  it("detects P0 from 'critical'", () => {
    const result = parsePriority("critical database issue");
    expect(result.priority).toBe("P0");
    expect(result.cleaned).toBe("database issue");
  });

  it("detects P1 from 'p1'", () => {
    const result = parsePriority("Review PR p1");
    expect(result.priority).toBe("P1");
    expect(result.cleaned).toBe("Review PR");
  });

  it("detects P3 from 'low'", () => {
    const result = parsePriority("Clean up docs low");
    expect(result.priority).toBe("P3");
    expect(result.cleaned).toBe("Clean up docs");
  });

  it("defaults to P2 when no priority detected", () => {
    const result = parsePriority("Normal task");
    expect(result.priority).toBe("P2");
    expect(result.cleaned).toBe("Normal task");
  });
});
