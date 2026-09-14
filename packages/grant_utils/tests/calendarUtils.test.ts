import { describe, it, expect } from 'vitest';
import { 
  getCalendarEvents, 
  getUpcomingEvents, 
  getEventsForMonth, 
  getMonthMatrix, 
  parseRawIcs, 
  generateIcsString 
} from '../src/calendarUtils.js';

describe('calendarUtils', () => {
  it('should load pre-parsed calendar events', () => {
    const events = getCalendarEvents();
    expect(events.length).toBe(46);
  });

  it('should filter upcoming events chronologically from reference date', () => {
    const upcoming = getUpcomingEvents('2026-09-10', 5);
    expect(upcoming.length).toBe(5);
    expect(upcoming[0].startDate >= '2026-09-10').toBe(true);
    for (let i = 0; i < upcoming.length - 1; i++) {
      expect(upcoming[i].startDate <= upcoming[i + 1].startDate).toBe(true);
    }
  });

  it('should filter events for a specific year and month', () => {
    const octEvents = getEventsForMonth(2026, 10);
    expect(octEvents.length).toBeGreaterThan(0);
    expect(octEvents.every(e => e.startDate.startsWith('2026-10'))).toBe(true);
  });

  it('should generate a 7-column month matrix with correct leading and trailing days', () => {
    const matrix = getMonthMatrix(2026, 10, '2026-10-01');
    expect(matrix.length).toBeGreaterThanOrEqual(4);
    for (const week of matrix) {
      expect(week.length).toBe(7);
    }
    const flatDays = matrix.flat();
    const oct1 = flatDays.find(d => d.dateStr === '2026-10-01');
    expect(oct1).toBeDefined();
    expect(oct1?.isCurrentMonth).toBe(true);
    expect(oct1?.isToday).toBe(true);
  });

  it('should parse raw RFC 5545 iCalendar content correctly', () => {
    const rawIcs = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Test//EN
BEGIN:VEVENT
UID:test-123@acba.coop
SUMMARY:[DEADLINE] Test Grant Due
DESCRIPTION:Submit $50,000 grant proposal.\\nacbf/grants/test_grant.md
DTSTART;VALUE=DATE:20261015
DTEND;VALUE=DATE:20261015
CATEGORIES:DEADLINE,GRANT
STATUS:CONFIRMED
BEGIN:VALARM
TRIGGER:-P7D
DESCRIPTION:Test Alarm
END:VALARM
END:VEVENT
END:VCALENDAR`;

    const parsed = parseRawIcs(rawIcs);
    expect(parsed.length).toBe(1);
    expect(parsed[0].uid).toBe('test-123@acba.coop');
    expect(parsed[0].startDate).toBe('2026-10-15');
    expect(parsed[0].grantFile).toBe('test_grant.md');
    expect(parsed[0].amount).toBe(50000);
    expect(parsed[0].alarms.length).toBe(1);
    expect(parsed[0].alarms[0].trigger).toBe('-P7D');
  });

  it('should generate valid RFC 5545 iCalendar string from events', () => {
    const events = getCalendarEvents().slice(0, 3);
    const icsString = generateIcsString(events);
    expect(icsString).toContain('BEGIN:VCALENDAR');
    expect(icsString).toContain('VERSION:2.0');
    expect(icsString).toContain('BEGIN:VEVENT');
    expect(icsString).toContain('END:VCALENDAR');
  });
});
