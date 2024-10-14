const offsetKeys = ['key', 'key5'];
const offsetParents = ['setting6'];
const specialKeys = ['wow', 'ops'];
const groups = ['common', 'group2', 'group3'];

const getIndent = (depth) => {
  return '  '.repeat(depth) + '      '; // Ajusta la indentación aquí
};

const formatValue = (value, depth) => {
  if (value === null) return 'null';
  if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
    const formattedEntries = Object.entries(value)
      .map(([key, val]) => `${getIndent(depth + 1)}${key}: ${formatValue(val, depth + 1)}`)
      .join('\n');
    return `{\n${formattedEntries}\n${getIndent(depth)}}`;
  }
  return value;
};

const formatNode = (node, depth) => {
  const key = node.key;
  const indent = getIndent(depth);

  switch (node.type) {
    case 'added':
      return `${indent}+ ${key}: ${formatValue(node.value, depth + 1)}`;
    case 'deleted':
      return `${indent}- ${key}: ${formatValue(node.value, depth + 1)}`;
    case 'changed':
      return `${indent}- ${key}: ${formatValue(node.value1, depth + 1)}\n${indent}+ ${key}: ${formatValue(node.value2, depth + 1)}`;
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