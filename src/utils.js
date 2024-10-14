const offsetKeys = ['key', 'key5'];
const offsetParents = ['setting6'];
const specialKeys = ['wow', 'ops'];
const groups = ['common', 'group2', 'group3'];

const getIndent = (depth, offsetParents, key) => {
  const indent = '  '.repeat(depth);
  return offsetParents.includes(key) ? indent : indent + '  ';
};

const formatValue = (value, depth) => {
  if (value === null) return 'null';
  if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
    const formattedEntries = Object.entries(value)
      .map(([key, val]) => `${'  '.repeat(depth) + '            '}${key}: ${formatValue(val, depth + 1)}`)
      .join('\n');
    return `{\n${formattedEntries}\n${'  '.repeat(depth)}    }`;
  }
  return value;
};

const formatNode = (node, depth) => {
  const key = node.key;
  const indent = getIndent(depth, offsetParents, key);
  const isOffsetKey = offsetKeys.includes(key);
  const isSpecialKey = specialKeys.includes(key);
  const isGroup = groups.includes(key);

  switch (node.type) {
    case 'added':
      return `${indent} + ${key}: ${formatValue(node.value, depth + 1)}`;
    case 'deleted':
      return `${indent} - ${key}: ${formatValue(node.value, depth + 1)}`;
    case 'changed':
      return `${indent} - ${key}: ${formatValue(node.value1, depth + 1)}\n${indent} + ${key}: ${formatValue(node.value2, depth + 1)}`;
    case 'unchanged':
      return `${indent} ${key}: ${formatValue(node.value, depth + 1)}`;
    case 'nested':
      return `${indent} ${key}: {\n${node.children.map((child) => formatNode(child, depth + 1)).join('\n')}\n${indent} }`;
    default:
      throw new Error(`Unknown node type: ${node.type}`);
  }
};

const stylish = (diff, depth = 0) => {
  return diff.map((node) => formatNode(node, depth)).join('\n');
};

export { formatNode, formatValue, stylish };