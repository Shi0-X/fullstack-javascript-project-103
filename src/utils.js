const formatNode = (node, depth) => {
  const key = node.key;
  const indent = depth > 0 ? '  '.repeat(depth - 1) : ''; // Verifica si depth es mayor que 0

  switch (node.type) {
    case 'added':
      return `${indent}+ ${key}: ${formatValue(node.value, depth)}`;
    case 'deleted':
      return `${indent}- ${key}: ${formatValue(node.value, depth)}`;
    case 'changed':
      return `${indent}- ${key}: ${formatValue(node.value1, depth)}\n${indent}+ ${key}: ${formatValue(node.value2, depth)}`;
    case 'unchanged':
      return `${indent}  ${key}: ${formatValue(node.value, depth)}`;
    case 'nested':
      return `${indent}  ${key}: {\n${stylish(node.children, depth + 1)}\n${indent}  }`;
    default:
      throw new Error(`Unknown node type: ${node.type}`);
  }
};

const formatValue = (value, depth) => {
  if (value === null) {
    return 'null';
  }
  if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
    const formattedEntries = Object.entries(value)
      .map(([key, val]) => `${'  '.repeat(depth)}${key}: ${formatValue(val, depth + 1)}`)
      .join('\n');
    return `{\n${formattedEntries}\n${'  '.repeat(depth - 1)}}`;
  }
  return value;
};

const stylish = (diff, depth = 1) => {
  const result = diff.map((child) => formatNode(child, depth)).join('\n');
  return result;
};

export { formatNode, formatValue, stylish };