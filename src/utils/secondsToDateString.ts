export function secondsToDateString(sec: number) {
  // 2020-12-13 22:03:28
  return new Date(sec * 1000).toISOString().replace('T', ' ').split('.')[0];
}
