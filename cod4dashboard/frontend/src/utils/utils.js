export const formatDuration = ms => {
  if (ms < 0) ms = -ms;
  const time = {
    day: Math.floor(ms / 86400000),
    hour: Math.floor(ms / 3600000) % 24,
    minute: Math.floor(ms / 60000) % 60,
    second: Math.floor(ms / 1000) % 60,
    millisecond: Math.floor(ms) % 1000
  };
  return Object.entries(time)
    .filter(val => val[1] !== 0)
    .map(([key, val]) => `${val} ${key}${val !== 1 ? 's' : ''}`)
    .join(', ');
};

export const removeCodColors = str => {
  if (!str) return '';
  const regExp = new RegExp(/(\^\d{1})/, 'gmui');
  const output = str.replace(regExp, '');
  return output;
};

export const isEmpty = obj => {
  return Object.keys(obj).length === 0;
};
