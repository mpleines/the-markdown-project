export function truncateString(str: string): string {
  if (str.length <= 15) {
    return str;
  } else {
    return str.slice(0, 15) + '...';
  }
}
