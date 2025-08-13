export function toDateTimeString(value: number, long: boolean = false): string {
  if (isNaN(value)) return '';

  return new Date(value * 1000).toLocaleDateString('en-US', {
    weekday: 'long',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
}