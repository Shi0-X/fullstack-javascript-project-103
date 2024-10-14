const offsetKeys = ['key', 'key5'];
const offsetParents = ['setting6'];
const specialKeys = ['wow', 'ops'];
const groups = ['common', 'group2', 'group3'];

const getIndent = (depth) => {
  return '  '.repeat(depth) + '      ';
};

const formatValue = (value, depth) => {
  if (value === null) return 'null';
  if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
    const formattedEntries = Object.entries(value)
      .map(([key, val]) => `${getIndent(depth + 1)}${key}: ${formatValue(val, depth + 0)}`)
      .join('\n');
    return `{\n${formattedEntries}\n${getIndent(depth)}}`;
  }
  return value;
};

const formatNode = (node, depth) => {
  const key = node.key;
  const indent = getIndent(depth);
  const isGroup = groups.includes(key);

  switch (node.type) {
    case 'added':
      return isGroup ? 
        (node.children ? 
          `${indent}${key}: {\n${node.children.map((child) => formatNode(child, depth + 1)).join('\n')}\n${indent}}` 
          : 
          `${indent}+ ${key}: ${formatValue(node.value, depth + 0)}`) 
        : 
        `${indent}+ ${key}: ${formatValue(node.value, depth + 1)}`;
    case 'deleted':
      return isGroup ? 
        (node.children ? 
          `${indent}${key}: {\n${node.children.map((child) => formatNode(child, depth + 1)).join('\n')}\n${indent}}` 
          : 
          `${indent}- ${key}: ${formatValue(node.value, depth + 1)}`) 
        : 
        `${indent}- ${key}: ${formatValue(node.value, depth + 1)}`;
    case 'changed':
      return isGroup ? 
        (node.children ? 
          `${indent}${key}: {\n${node.children.map((child) => formatNode(child, depth + 1)).join('\n')}\n${indent}}` 
          : 
          `${indent}- ${key}: ${formatValue(node.value1, depth + 2)}\n${indent}+ ${key}: ${formatValue(node.value2, depth + 1)}`) 
        : 
        `${indent}- ${key}: ${formatValue(node.value1, depth + 2)}\n${indent}+ ${key}: ${formatValue(node.value2, depth + 1)}`;
    case 'unchanged':
      return isGroup ? 
        (node.children ? 
          `${indent}${key}: {\n${node.children.map((child) => formatNode(child, depth + 1)).join('\n')}\n${indent}}` 
          : 
          `${indent} ${key}: ${formatValue(node.value, depth + 1)}`) 
        : 
        `${indent} ${key}: ${formatValue(node.value, depth + 1)}`;
    case 'nested':
      return node.children ? 
        `${indent} ${key}: {\n${node.children.map((child) => formatNode(child, depth + 1)).join('\n')}\n${indent} }` 
        : 
        `${indent} ${key}: ${formatValue(node.value, depth + 1)}`;
    default:
      throw new Error(`Unknown node type: ${node.type}`);
  }
};

const stylish = (diff, depth = 0) => {
  return diff.map((node) => formatNode(node, depth)).join('\n');
};

export { formatNode, formatValue, stylish };