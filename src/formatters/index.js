// formatters/index.js
import stylish from './stylish.js';
import plain from './plain.js';
import json from './json.js'; // Importa el nuevo formateador

const formatters = {
  stylish,
  plain,
  json, // Agrega el formateador JSON al objeto
};

const formatDiff = (diff, format) => {
  if (!formatters[format]) {
    throw new Error(`Unknown format: ${format}`);
  }
  return formatters[format](diff);
};

export default formatDiff;
