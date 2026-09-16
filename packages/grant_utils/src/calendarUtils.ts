import type { CalendarEvent, CalendarAlarm } from './types.js';
import { CALENDAR_EVENTS } from './data/generatedCalendar.js';

let customCalendarEvents: CalendarEvent[] | null = null;

export function setCalendarEvents(events: CalendarEvent[]): void {
  customCalendarEvents = [...events];
}

export function addCalendarEvents(events: CalendarEvent[]): void {
  const base = customCalendarEvents || CALENDAR_EVENTS;
  customCalendarEvents = [...base, ...events];
}

export function clearCalendarEvents(): void {
  customCalendarEvents = null;
}

export function getCalendarEvents(dataset?: CalendarEvent[]): CalendarEvent[] {
  const source = dataset || customCalendarEvents || CALENDAR_EVENTS;
  return [...source];
}

export function getDeterministicUid(evt: Partial<CalendarEvent>): string {
  const raw = `${evt.title || ''}_${evt.startDate || ''}_${evt.grantFile || ''}_${evt.endDate || ''}`;
  let hash = 0;
  for (let i = 0; i < raw.length; i++) {
    hash = ((hash << 5) - hash) + raw.charCodeAt(i);
    hash |= 0;
  }
  const cleanTitle = (evt.title || 'event').toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 30);
  return `${cleanTitle}-${Math.abs(hash)}@grant-utils`;
}

export function parseRawIcs(icsContent: string): CalendarEvent[] {
  const events: CalendarEvent[] = [];
  const lines = icsContent.split(/\r?\n/);
  let currentEvent: CalendarEvent | null = null;
  let currentAlarm: CalendarAlarm | null = null;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    while (i + 1 < lines.length && /^[ \t]/.test(lines[i + 1])) {
      line += lines[i + 1].slice(1);
      i++;
    }

    if (line.startsWith('BEGIN:VEVENT')) {
      currentEvent = {
        uid: '',
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        location: '',
        categories: [],
        status: 'CONFIRMED',
        alarms: []
      };
    } else if (line.startsWith('END:VEVENT')) {
      if (currentEvent) {
        if (!currentEvent.uid) {
          currentEvent.uid = getDeterministicUid(currentEvent);
        }
        events.push(currentEvent);
        currentEvent = null;
      }
    } else if (line.startsWith('BEGIN:VALARM')) {
      currentAlarm = { trigger: '', description: '' };
    } else if (line.startsWith('END:VALARM')) {
      if (currentEvent && currentAlarm) {
        currentEvent.alarms.push(currentAlarm);
        currentAlarm = null;
      }
    } else if (currentAlarm) {
      if (line.startsWith('TRIGGER:')) {
        currentAlarm.trigger = line.substring('TRIGGER:'.length).trim();
      } else if (line.startsWith('DESCRIPTION:')) {
        currentAlarm.description = line.substring('DESCRIPTION:'.length).replace(/\\n/g, '\n').replace(/\\,/g, ',').trim();
      }
    } else if (currentEvent) {
      if (line.startsWith('UID:')) {
        currentEvent.uid = line.substring('UID:'.length).trim();
      } else if (line.startsWith('SUMMARY:')) {
        currentEvent.title = line.substring('SUMMARY:'.length).replace(/\\n/g, '\n').replace(/\\,/g, ',').trim();
      } else if (line.startsWith('DESCRIPTION:')) {
        currentEvent.description = line.substring('DESCRIPTION:'.length).replace(/\\n/g, '\n').replace(/\\,/g, ',').trim();
      } else if (line.startsWith('LOCATION:')) {
        currentEvent.location = line.substring('LOCATION:'.length).replace(/\\,/g, ',').trim();
      } else if (line.startsWith('CATEGORIES:')) {
        currentEvent.categories = line.substring('CATEGORIES:'.length).split(',').map(c => c.trim());
      } else if (line.startsWith('STATUS:')) {
        currentEvent.status = line.substring('STATUS:'.length).trim();
      } else if (line.startsWith('X-GRANT-FILE:')) {
        currentEvent.grantFile = line.substring('X-GRANT-FILE:'.length).trim();
      } else if (line.startsWith('X-GRANT-AMOUNT:')) {
        currentEvent.amount = parseInt(line.substring('X-GRANT-AMOUNT:'.length).trim(), 10) || undefined;
      } else if (line.startsWith('X-TAGS:')) {
        currentEvent.tags = line.substring('X-TAGS:'.length).split(',').map(t => t.trim());
      } else if (line.startsWith('DTSTART')) {
        const parts = line.split(':');
        const rawDate = parts[1]?.trim();
        if (rawDate) {
          currentEvent.startDate = rawDate.length === 8 
            ? `${rawDate.slice(0, 4)}-${rawDate.slice(4, 6)}-${rawDate.slice(6, 8)}`
            : rawDate;
        }
      } else if (line.startsWith('DTEND')) {
        const parts = line.split(':');
        const rawDate = parts[1]?.trim();
        if (rawDate) {
          currentEvent.endDate = rawDate.length === 8 
            ? `${rawDate.slice(0, 4)}-${rawDate.slice(4, 6)}-${rawDate.slice(6, 8)}`
            : rawDate;
        }
      }
    }
  }

  events.forEach(evt => {
    const desc = evt.description || '';
    if (!evt.grantFile) {
      const matchFile = desc.match(/(?:data\/)?(?:[a-zA-Z0-9_-]+\/)?grants\/([a-zA-Z0-9_-]+\.md)/);
      if (matchFile) {
        evt.grantFile = matchFile[1];
      }
    }
    if (evt.amount === undefined) {
      const matchAmt = desc.match(/\$([0-9,]+)/);
      if (matchAmt) {
        evt.amount = parseInt(matchAmt[1].replace(/,/g, ''), 10);
      }
    }
  });

  return events;
}

export const parseIcsContent = parseRawIcs;

export function getUpcomingEvents(
  referenceDateStr: string = new Date().toISOString().slice(0, 10), 
  limit?: number, 
  dataset?: CalendarEvent[]
): CalendarEvent[] {
  const events = getCalendarEvents(dataset);
  const sorted = events
    .filter(evt => evt.startDate >= referenceDateStr)
    .sort((a, b) => a.startDate.localeCompare(b.startDate));
  return limit ? sorted.slice(0, limit) : sorted;
}

export function getEventsForMonth(year: number, month: number, dataset?: CalendarEvent[]): CalendarEvent[] {
  const monthStr = month < 10 ? `0${month}` : `${month}`;
  const prefix = `${year}-${monthStr}`;
  return getCalendarEvents(dataset).filter(evt => evt.startDate.startsWith(prefix));
}

export interface DayCell {
  day: number;
  dateStr: string;
  isCurrentMonth: boolean;
  isToday: boolean;
  isWeekend: boolean;
  events: CalendarEvent[];
}

export function getMonthMatrix(
  year: number, 
  month: number, 
  todayStr: string = new Date().toISOString().slice(0, 10), 
  dataset?: CalendarEvent[]
): DayCell[][] {
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);
  const numDays = lastDay.getDate();
  const startDayOfWeek = firstDay.getDay(); // 0 = Sunday

  const prevMonthLastDay = new Date(year, month - 1, 0).getDate();
  const events = getCalendarEvents(dataset);

  const weeks: DayCell[][] = [];
  let currentWeek: DayCell[] = [];

  // Previous month trailing days
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const day = prevMonthLastDay - i;
    const prevMonth = month === 1 ? 12 : month - 1;
    const prevYear = month === 1 ? year - 1 : year;
    const mStr = prevMonth < 10 ? `0${prevMonth}` : `${prevMonth}`;
    const dStr = day < 10 ? `0${day}` : `${day}`;
    const dateStr = `${prevYear}-${mStr}-${dStr}`;

    currentWeek.push({
      day,
      dateStr,
      isCurrentMonth: false,
      isToday: dateStr === todayStr,
      isWeekend: currentWeek.length === 0 || currentWeek.length === 6,
      events: events.filter(e => e.startDate === dateStr)
    });
  }

  // Current month days
  for (let day = 1; day <= numDays; day++) {
    const mStr = month < 10 ? `0${month}` : `${month}`;
    const dStr = day < 10 ? `0${day}` : `${day}`;
    const dateStr = `${year}-${mStr}-${dStr}`;

    const cell: DayCell = {
      day,
      dateStr,
      isCurrentMonth: true,
      isToday: dateStr === todayStr,
      isWeekend: currentWeek.length === 0 || currentWeek.length === 6,
      events: events.filter(e => e.startDate === dateStr)
    };

    currentWeek.push(cell);

    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  // Next month leading days
  if (currentWeek.length > 0) {
    let nextDay = 1;
    const nextMonth = month === 12 ? 1 : month + 1;
    const nextYear = month === 12 ? year + 1 : year;
    while (currentWeek.length < 7) {
      const mStr = nextMonth < 10 ? `0${nextMonth}` : `${nextMonth}`;
      const dStr = nextDay < 10 ? `0${nextDay}` : `${nextDay}`;
      const dateStr = `${nextYear}-${mStr}-${dStr}`;

      currentWeek.push({
        day: nextDay,
        dateStr,
        isCurrentMonth: false,
        isToday: dateStr === todayStr,
        isWeekend: currentWeek.length === 0 || currentWeek.length === 6,
        events: events.filter(e => e.startDate === dateStr)
      });
      nextDay++;
    }
    weeks.push(currentWeek);
  }

  return weeks;
}

export interface CalendarExportOptions {
  prodId?: string;
  calName?: string;
  timezone?: string;
}

export function generateIcsString(
  events: CalendarEvent[] = getCalendarEvents(),
  options?: CalendarExportOptions
): string {
  let ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    options?.prodId ? `PRODID:${options.prodId}` : 'PRODID:-//Grantwriting Calendar Engine//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    options?.calName ? `X-WR-CALNAME:${options.calName}` : 'X-WR-CALNAME:Grant Deadlines & Funding Calendar',
    options?.timezone ? `X-WR-TIMEZONE:${options.timezone}` : 'X-WR-TIMEZONE:America/Chicago'
  ];

  for (const evt of events) {
    const sDate = evt.startDate.replace(/-/g, '');
    const eDate = evt.endDate ? evt.endDate.replace(/-/g, '') : sDate;
    ics.push('BEGIN:VEVENT');
    ics.push(`UID:${evt.uid || getDeterministicUid(evt)}`);
    ics.push(`DTSTART;VALUE=DATE:${sDate}`);
    ics.push(`DTEND;VALUE=DATE:${eDate}`);
    ics.push(`SUMMARY:${(evt.title || '').replace(/\n/g, '\\n').replace(/,/g, '\\,')}`);
    ics.push(`DESCRIPTION:${(evt.description || '').replace(/\n/g, '\\n').replace(/,/g, '\\,')}`);
    if (evt.location) ics.push(`LOCATION:${evt.location.replace(/,/g, '\\,')}`);
    if (evt.categories && evt.categories.length) ics.push(`CATEGORIES:${evt.categories.join(',')}`);
    if (evt.grantFile) ics.push(`X-GRANT-FILE:${evt.grantFile}`);
    if (evt.amount !== undefined) ics.push(`X-GRANT-AMOUNT:${evt.amount}`);
    if (evt.tags && evt.tags.length) ics.push(`X-TAGS:${evt.tags.join(',')}`);
    ics.push(`STATUS:${evt.status || 'CONFIRMED'}`);
    ics.push('TRANSP:TRANSPARENT');

    if (evt.alarms && evt.alarms.length) {
      for (const a of evt.alarms) {
        ics.push('BEGIN:VALARM');
        ics.push('ACTION:DISPLAY');
        ics.push(`TRIGGER:${a.trigger || '-P7D'}`);
        ics.push(`DESCRIPTION:${(a.description || evt.title).replace(/\n/g, '\\n').replace(/,/g, '\\,')}`);
        ics.push('END:VALARM');
      }
    }
    ics.push('END:VEVENT');
  }

  ics.push('END:VCALENDAR');
  return ics.join('\r\n');
}
