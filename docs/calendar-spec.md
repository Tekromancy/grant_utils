# RFC 5545 Calendar Specification & Subscription Guide

The master `calendar.ics` feed adheres strictly to the **Internet Calendaring and Scheduling Core Object Specification (RFC 5545)**. It acts as the single source of truth for all deadlines, webinars, and compliance alarm dates.

---

## 📅 Structure of a Grant Calendar Event

Each event is wrapped in a `VEVENT` block:

```ics
BEGIN:VEVENT
UID:unique-grant-id@organization.org
DTSTAMP:20260914T120000Z
DTSTART;VALUE=DATE:20270415
DTEND;VALUE=DATE:20270415
SUMMARY:DEADLINE: EDA Build to Scale ($300,000)
DESCRIPTION:Cooperative Capitalization & Revolving Debt Pool\nFunder: U.S. Economic Development Administration\nPackage: data/grants/01_first_opportunity.md
LOCATION:https://grants.gov
CATEGORIES:Federal,Major Spring Federal
STATUS:CONFIRMED
BEGIN:VALARM
TRIGGER:-P14D
ACTION:DISPLAY
DESCRIPTION:REMINDER: 14 Days until submission deadline
END:VALARM
BEGIN:VALARM
TRIGGER:-P3D
ACTION:DISPLAY
DESCRIPTION:FINAL WARNING: 3 Days until submission deadline
END:VALARM
END:VEVENT
```

---

## 🔔 Standard Alarm Triggers

Every deadline event includes two automated reminders:
- **`-P14D` (14 Days Prior):** Primary preparation alarm for draft finalization, board approval, and clerical attachment verification.
- **`-P3D` (3 Days Prior):** Urgent final warning for SAM.gov validation, Workspace sign-off, and Grants.gov package upload.

---

## 📲 Subscribing in Calendar Applications

Team members can subscribe directly to the feed:

### Google Calendar
1. Open Google Calendar.
2. Under **Other calendars**, click **+** ➔ **From URL**.
3. Paste the raw GitHub or static web URL of `calendar.ics` (e.g. `https://raw.githubusercontent.com/MyOrg/grantwriting/main/calendar.ics`).
4. Click **Add calendar**.

### Apple Calendar (macOS / iOS)
1. In Calendar, select **File** ➔ **New Calendar Subscription**.
2. Enter the URL of `calendar.ics`.
3. Set auto-refresh frequency to **Every hour** or **Daily**.

### Microsoft Outlook & Thunderbird
1. Click **Add Calendar** ➔ **Subscribe from web**.
2. Enter the `.ics` link and confirm.
