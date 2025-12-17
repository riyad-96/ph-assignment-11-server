import { format } from 'date-fns';

export function getLastSevenDays() {
  const days = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(format(d, 'dd-MMM-y'));
  }
  return days;
}
