export const INITIAL_DATE = '2026-11-06';

export function formatDateToISO(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseISODate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day, 12, 0, 0);
}

export function formatHeaderDate(dateStr: string): string {
  const date = parseISODate(dateStr);
  const day = String(date.getDate()).padStart(2, '0');
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

export function formatHeroDate(dateStr: string): string {
  const date = parseISODate(dateStr);
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const dayName = days[date.getDay()];
  const dayNum = String(date.getDate()).padStart(2, '0');
  const monthName = months[date.getMonth()];
  const year = date.getFullYear();
  return `${dayName}, ${dayNum} ${monthName} ${year}`;
}

export function formatMonthYear(year: number, monthIndex: number): string {
  const months = [
    'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
    'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
  ];
  return `${months[monthIndex]} ${year}`;
}

export function shiftDate(dateStr: string, days: number): string {
  const date = parseISODate(dateStr);
  date.setDate(date.getDate() + days);
  return formatDateToISO(date);
}

export function isSameDay(date1: string, date2: string): boolean {
  return date1 === date2;
}

export function getMonthMatrix(year: number, monthIndex: number) {
  // First day of the month
  const firstDay = new Date(year, monthIndex, 1);
  const lastDay = new Date(year, monthIndex + 1, 0);

  // 0 is Sunday, let's start Monday (or Sunday). Planner style usually starts Monday: Mon=0 .. Sun=6
  let startingDayOfWeek = firstDay.getDay(); // 0 is Sunday, 1 is Monday
  // Let's use Monday as start (ISO style: Mon 0, Tue 1, Wed 2, Thu 3, Fri 4, Sat 5, Sun 6)
  const adjustedStart = (startingDayOfWeek + 6) % 7;

  const daysInMonth = lastDay.getDate();
  const matrix: Array<Array<{ dateStr: string; dayNumber: number; isCurrentMonth: boolean }>> = [];

  let currentWeek: Array<{ dateStr: string; dayNumber: number; isCurrentMonth: boolean }> = [];

  // Previous month trailing days
  const prevMonthLastDay = new Date(year, monthIndex, 0).getDate();
  for (let i = adjustedStart - 1; i >= 0; i--) {
    const day = prevMonthLastDay - i;
    const prevDate = new Date(year, monthIndex - 1, day);
    currentWeek.push({
      dateStr: formatDateToISO(prevDate),
      dayNumber: day,
      isCurrentMonth: false,
    });
  }

  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, monthIndex, day);
    currentWeek.push({
      dateStr: formatDateToISO(date),
      dayNumber: day,
      isCurrentMonth: true,
    });

    if (currentWeek.length === 7) {
      matrix.push(currentWeek);
      currentWeek = [];
    }
  }

  // Next month leading days to complete week
  if (currentWeek.length > 0) {
    let nextMonthDay = 1;
    while (currentWeek.length < 7) {
      const nextDate = new Date(year, monthIndex + 1, nextMonthDay);
      currentWeek.push({
        dateStr: formatDateToISO(nextDate),
        dayNumber: nextMonthDay,
        isCurrentMonth: false,
      });
      nextMonthDay++;
    }
    matrix.push(currentWeek);
  }

  return matrix;
}
