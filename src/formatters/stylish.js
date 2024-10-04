import { stylish, formatValue } from '../utils.js';

const stylishWithBraces = (diff) => {
  const innerOutput = stylish(diff);
  return `{\n${innerOutput}\n}`;
};

export default stylishWithBraces;