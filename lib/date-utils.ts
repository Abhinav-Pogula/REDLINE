// ============================================================================
// REDLINE — Deterministic date parsing helpers
// Pure, offline, no dependencies. Used by the extraction engine (to normalize
// dates mentioned in a transcript) and the conflict engine (to do real
// calendar math instead of only comparing status strings).
// ============================================================================

const MONTHS: Record<string, number> = {
  jan: 0, january: 0,
  feb: 1, february: 1,
  mar: 2, march: 2,
  apr: 3, april: 3,
  may: 4,
  jun: 5, june: 5,
  jul: 6, july: 6,
  aug: 7, august: 7,
  sep: 8, sept: 8, september: 8,
  oct: 9, october: 9,
  nov: 10, november: 10,
  dec: 11, december: 11,
};

const WEEKDAYS: Record<string, number> = {
  sunday: 0, sun: 0,
  monday: 1, mon: 1,
  tuesday: 2, tue: 2, tues: 2,
  wednesday: 3, wed: 3,
  thursday: 4, thu: 4, thurs: 4,
  friday: 5, fri: 5,
  saturday: 6, sat: 6,
};

const WORD_NUMBERS: Record<string, number> = {
  one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8,
  nine: 9, ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14,
  fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19, twenty: 20,
  "a couple of": 2, "a couple": 2,
};

function startOfDay(d: Date): Date {
  const c = new Date(d);
  c.setHours(0, 0, 0, 0);
  return c;
}

function ordinalToNumber(text: string): number | null {
  const cleaned = text.trim().toLowerCase().replace(/,/g, "");
  if (/^\d+(st|nd|rd|th)?$/.test(cleaned)) {
    return parseInt(cleaned, 10);
  }
  if (WORD_NUMBERS[cleaned] !== undefined) return WORD_NUMBERS[cleaned];
  return null;
}

/**
 * Attempts to parse a natural-language date fragment relative to `reference`.
 * Returns null when no confident parse is possible (never throws).
 */
export function parseFlexibleDate(text: string, reference: Date = new Date()): Date | null {
  if (!text) return null;
  const t = text.trim().toLowerCase();
  const ref = startOfDay(reference);

  // ISO / numeric: 2026-09-28, 09/28/2026, 9-28
  const isoMatch = t.match(/(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (isoMatch) {
    const [, y, m, d] = isoMatch;
    const dt = new Date(parseInt(y, 10), parseInt(m, 10) - 1, parseInt(d, 10));
    if (!isNaN(dt.getTime())) return dt;
  }
  const slashMatch = t.match(/(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?/);
  if (slashMatch) {
    const [, mm, dd, yy] = slashMatch;
    const year = yy ? (yy.length === 2 ? 2000 + parseInt(yy, 10) : parseInt(yy, 10)) : ref.getFullYear();
    const dt = new Date(year, parseInt(mm, 10) - 1, parseInt(dd, 10));
    if (!isNaN(dt.getTime())) return dt;
  }

  // "today" / "tomorrow" / "yesterday"
  if (/\btoday\b/.test(t)) return ref;
  if (/\btomorrow\b/.test(t)) {
    const dt = new Date(ref);
    dt.setDate(dt.getDate() + 1);
    return dt;
  }
  if (/\byesterday\b/.test(t)) {
    const dt = new Date(ref);
    dt.setDate(dt.getDate() - 1);
    return dt;
  }

  // "Month Day[, Year]" e.g. "September 28", "sept 28th", "Oct 12, 2026"
  const monthNamePattern = Object.keys(MONTHS).sort((a, b) => b.length - a.length).join("|");
  const monthDayRe = new RegExp(`\\b(${monthNamePattern})\\.?\\s+(\\d{1,2})(?:st|nd|rd|th)?(?:,?\\s+(\\d{4}))?`, "i");
  const monthDayMatch = t.match(monthDayRe);
  if (monthDayMatch) {
    const month = MONTHS[monthDayMatch[1].toLowerCase()];
    const day = parseInt(monthDayMatch[2], 10);
    const year = monthDayMatch[3] ? parseInt(monthDayMatch[3], 10) : ref.getFullYear();
    const dt = new Date(year, month, day);
    if (!isNaN(dt.getTime())) return dt;
  }

  // "the 19th" / "on the 12th" — day-of-month only, roll into reference month (or next month if already passed)
  const dayOnlyMatch = t.match(/\bthe\s+(\d{1,2})(st|nd|rd|th)\b/) || t.match(/\bon\s+the\s+(\d{1,2})(st|nd|rd|th)\b/);
  if (dayOnlyMatch) {
    const day = parseInt(dayOnlyMatch[1], 10);
    let dt = new Date(ref.getFullYear(), ref.getMonth(), day);
    if (dt.getTime() < ref.getTime()) {
      dt = new Date(ref.getFullYear(), ref.getMonth() + 1, day);
    }
    if (!isNaN(dt.getTime())) return dt;
  }

  // Weekday names — "Friday", "next Friday", "this Friday" -> nearest upcoming occurrence
  const weekdayPattern = Object.keys(WEEKDAYS).sort((a, b) => b.length - a.length).join("|");
  const weekdayRe = new RegExp(`\\b(next\\s+)?(${weekdayPattern})\\b`, "i");
  const weekdayMatch = t.match(weekdayRe);
  if (weekdayMatch) {
    const wantsNextWeek = !!weekdayMatch[1];
    const targetDow = WEEKDAYS[weekdayMatch[2].toLowerCase()];
    const dt = new Date(ref);
    let delta = (targetDow - ref.getDay() + 7) % 7;
    if (delta === 0) delta = 7; // "Friday" said on a Friday means the upcoming one, not today
    dt.setDate(dt.getDate() + delta + (wantsNextWeek ? 7 : 0));
    return dt;
  }

  // "in N days/weeks"
  const relativeMatch = t.match(/\bin\s+(\d+|[a-z\s]+?)\s+(day|days|week|weeks)\b/);
  if (relativeMatch) {
    const n = ordinalToNumber(relativeMatch[1]) ?? parseInt(relativeMatch[1], 10);
    if (!isNaN(n)) {
      const multiplier = relativeMatch[2].startsWith("week") ? 7 : 1;
      const dt = new Date(ref);
      dt.setDate(dt.getDate() + n * multiplier);
      return dt;
    }
  }

  return null;
}

/** Extracts "N days before" style lead-time requirements from constraint text, e.g. "must be completed two days before launch" -> 2. */
export function extractLeadTimeDays(text: string): number | null {
  const t = text.toLowerCase();
  const numberPattern = `\\d+|${Object.keys(WORD_NUMBERS).join("|")}`;
  const re = new RegExp(`(${numberPattern})[\\s-]*(day|days|week|weeks)\\s*(before|prior to|ahead of|in advance of)`, "i");
  const match = t.match(re);
  if (!match) return null;
  const n = ordinalToNumber(match[1]) ?? parseInt(match[1], 10);
  if (isNaN(n)) return null;
  const multiplier = match[2].startsWith("week") ? 7 : 1;
  return n * multiplier;
}

export function diffInDays(a: Date, b: Date): number {
  const MS_PER_DAY = 1000 * 60 * 60 * 24;
  return Math.round((startOfDay(a).getTime() - startOfDay(b).getTime()) / MS_PER_DAY);
}

export function toISODate(d: Date): string {
  return startOfDay(d).toISOString().slice(0, 10);
}

/** "SEP 28" style short label used throughout the timeline UI. */
export function toShortLabel(d: Date): string {
  const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  return `${months[d.getMonth()]} ${d.getDate()}`;
}

/** "September 28" style full label used for decision/constraint values. */
export function toLongLabel(d: Date): string {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  return `${months[d.getMonth()]} ${d.getDate()}`;
}
