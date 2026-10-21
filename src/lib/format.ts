export function formatRange(start?: string, end?: string) {
  if (!start || !end) return '';
  const fmt = (d: string) =>
    new Date(`${d}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' });
  return start === end ? fmt(start) : `${fmt(start)} to ${fmt(end)}`;
}
