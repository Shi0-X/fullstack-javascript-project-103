const OFFSET_VALUE = 'offset';
const ADD_VALUE = 'added';
const DELETED_VALUE = 'deleted';
const UNCHANGED_VALUE = 'unchanged';
const NESTED_VALUE = 'nested';

const renderFunctions = {
  [ADD_VALUE]: (node, depth) => `${getIndentation(depth)} + ${node.key}: ${formatValue(node.value, depth)}`,
  [DELETED_VALUE]: (node, depth) => `${getIndentation(depth)} - ${node.key}: ${formatValue(node.value, depth)}`,
  [UNCHANGED_VALUE]: (node, depth) => `${getIndentation(depth)}   ${node.key}: ${formatValue(node.value, depth)}`,
  [NESTED_VALUE]: (node, depth) => `${getIndentation(depth + 1)}${node.key}: {\n${node.children.map((child) => renderFunctions[child.type](child, depth + 2)).join('\n')}\n${getIndentation(depth + 1)}}`,
  changed: (node, depth) => `${getIndentation(depth)} - ${node.key}: ${formatValue(node.value1, depth)}\n${getIndentation(depth)} + ${node.key}: ${formatValue(node.value2, depth)}`,
};

const getIndentation = (depth, spacesCount = 4) => {
  if (depth < 0) return '';
  return ' '.repeat(depth * spacesCount);
};

const formatValue = (value, depth) => {
  if (value === null) return 'null';
  if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
    const formattedEntries = Object.entries(value)
      .map(([key, val]) => `${getIndentation(depth + 2)}${key}: ${formatValue(val, depth + 2)}`)
      .join('\n');
    return `{\n${formattedEntries}\n${getIndentation(depth + 1)}}`;
  }
  return value;
};

const formatNode = (node, depth) => renderFunctions[node.type](node, depth);

const stylish = (diff) => {
  return diff.map((node) => formatNode(node, 0)).join('\n');
};

const stylishWithBraces = (diff) => {
  const innerOutput = stylish(diff);
  return `{\n${innerOutput}\n}`;
};

export { formatNode, formatValue, stylish, stylishWithBraces };