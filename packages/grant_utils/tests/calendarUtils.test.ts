import { describe, it, expect, beforeEach } from 'vitest';
import { 
  getCalendarEvents, 
  getUpcomingEvents, 
  getEventsForMonth, 
  getMonthMatrix, 
  parseRawIcs, 
  generateIcsString,
  setCalendarEvents,
  clearCalendarEvents
} from '../src/calendarUtils.js';
import type { CalendarEvent } from '../src/types.js';

const MOCK_EVENTS: CalendarEvent[] = [
  {
    uid: 'event-1@grant-utils',
    title: '[DEADLINE] Fall Workforce Grant',
    description: 'Submit grant proposal',
    startDate: '2026-09-15',
    endDate: '2026-09-15',
    location: 'Online Portal',
    categories: ['DEADLINE', 'CORPORATE'],
    status: 'CONFIRMED',
    alarms: [{ trigger: '-P7D', description: 'Reminder' }],
    amount: 50000
  },
  {
    uid: 'event-2@grant-utils',
    title: '[DEADLINE] Apex Climate Challenge LOI',
    description: 'Submit LOI proposal',
    startDate: '2026-10-15',
    endDate: '2026-10-15',
    location: 'Fluxx Portal',
    categories: ['DEADLINE', 'FOUNDATION'],
    status: 'CONFIRMED',
    alarms: [],
    amount: 250000
  },
  {
    uid: 'event-3@grant-utils',
    title: '[DEADLINE] Federal Resilient Infrastructure Grant',
    description: 'Federal grant submission',
    startDate: '2026-10-25',
    endDate: '2026-10-25',
    location: 'Grants.gov',
    categories: ['DEADLINE', 'FEDERAL'],
    status: 'CONFIRMED',
    alarms: [],
    amount: 250000
  }
];

describe('calendarUtils', () => {
  beforeEach(() => {
    clearCalendarEvents();
  });

  it('should return empty list by default when no events are loaded', () => {
    const events = getCalendarEvents();
    expect(events.length).toBe(0);
  });

  it('should support dynamic registration of calendar events', () => {
    setCalendarEvents(MOCK_EVENTS);
    const events = getCalendarEvents();
    expect(events.length).toBe(3);
  });

  it('should filter upcoming events chronologically from reference date', () => {
    setCalendarEvents(MOCK_EVENTS);
    const upcoming = getUpcomingEvents('2026-09-10', 5);
    expect(upcoming.length).toBe(3);
    expect(upcoming[0].startDate >= '2026-09-10').toBe(true);
    for (let i = 0; i < upcoming.length - 1; i++) {
      expect(upcoming[i].startDate <= upcoming[i + 1].startDate).toBe(true);
    }
  });

  it('should filter events for a specific year and month', () => {
    setCalendarEvents(MOCK_EVENTS);
    const octEvents = getEventsForMonth(2026, 10);
    expect(octEvents.length).toBe(2);
    expect(octEvents.every(e => e.startDate.startsWith('2026-10'))).toBe(true);
  });

  it('should generate a 7-column month matrix with correct leading and trailing days', () => {
    setCalendarEvents(MOCK_EVENTS);
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

    const oct15 = flatDays.find(d => d.dateStr === '2026-10-15');
    expect(oct15?.events.length).toBe(1);
    expect(oct15?.events[0].title).toContain('Apex Climate');
  });

  it('should parse raw RFC 5545 iCalendar content correctly', () => {
    const rawIcs = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Test//EN
BEGIN:VEVENT
UID:test-123@grant-utils
SUMMARY:[DEADLINE] Test Grant Due
DESCRIPTION:Submit $50,000 grant proposal.\\ndata/grants/test_grant.md
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
    expect(parsed[0].uid).toBe('test-123@grant-utils');
    expect(parsed[0].startDate).toBe('2026-10-15');
    expect(parsed[0].grantFile).toBe('test_grant.md');
    expect(parsed[0].amount).toBe(50000);
    expect(parsed[0].alarms.length).toBe(1);
    expect(parsed[0].alarms[0].trigger).toBe('-P7D');
  });

  it('should generate valid RFC 5545 iCalendar string from events', () => {
    const icsString = generateIcsString(MOCK_EVENTS);
    expect(icsString).toContain('BEGIN:VCALENDAR');
    expect(icsString).toContain('VERSION:2.0');
    expect(icsString).toContain('BEGIN:VEVENT');
    expect(icsString).toContain('END:VCALENDAR');
    expect(icsString).toContain('Fall Workforce Grant');
  });
});
