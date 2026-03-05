const DAY_MS = 86400000;

function nextWeekday(fromDate: Date, targetDay: number): Date {
  const current = fromDate.getDay();
  let daysUntil = targetDay - current;
  if (daysUntil <= 0) daysUntil += 7;
  return new Date(fromDate.getTime() + daysUntil * DAY_MS);
}

const WEEKDAYS: Record<string, number> = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};

export function parseDate(text: string): { date: Date | null; cleaned: string } {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let date: Date | null = null;
  let cleaned = text;

  // "today"
  const todayMatch = text.match(/\btoday\b/i);
  if (todayMatch) {
    date = today;
    cleaned = cleaned.replace(/\btoday\b/i, "").trim();
    return { date, cleaned };
  }

  // "tomorrow"
  const tomorrowMatch = text.match(/\btomorrow\b/i);
  if (tomorrowMatch) {
    date = new Date(today.getTime() + DAY_MS);
    cleaned = cleaned.replace(/\btomorrow\b/i, "").trim();
    return { date, cleaned };
  }

  // "next <weekday>"
  const nextDayMatch = text.match(/\bnext\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i);
  if (nextDayMatch) {
    const dayName = nextDayMatch[1].toLowerCase();
    const targetDay = WEEKDAYS[dayName];
    // "next <day>" means the one in the coming week (skip this week's occurrence)
    const upcoming = nextWeekday(today, targetDay);
    date = new Date(upcoming.getTime() + 7 * DAY_MS);
    // If the upcoming day is already more than 7 days away, use it directly
    if (upcoming.getTime() - today.getTime() > 7 * DAY_MS) {
      date = upcoming;
    }
    cleaned = cleaned.replace(/\bnext\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i, "").trim();
    return { date, cleaned };
  }

  // "in X days"
  const inDaysMatch = text.match(/\bin\s+(\d+)\s+days?\b/i);
  if (inDaysMatch) {
    const days = parseInt(inDaysMatch[1], 10);
    date = new Date(today.getTime() + days * DAY_MS);
    cleaned = cleaned.replace(/\bin\s+\d+\s+days?\b/i, "").trim();
    return { date, cleaned };
  }

  // bare weekday name (means this coming occurrence)
  const weekdayMatch = text.match(/\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i);
  if (weekdayMatch) {
    const dayName = weekdayMatch[1].toLowerCase();
    date = nextWeekday(today, WEEKDAYS[dayName]);
    cleaned = cleaned.replace(/\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i, "").trim();
    return { date, cleaned };
  }

  return { date, cleaned };
}
