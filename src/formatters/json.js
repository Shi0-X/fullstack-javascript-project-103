// src/formatters/json.js

const json = (diff) => {
  const parsedDiff = typeof diff === 'string' ? JSON.parse(diff) : diff;
  return JSON.stringify(parsedDiff, null, 2);
};

export default json;