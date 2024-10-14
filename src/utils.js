const formatNode = (node, depth) => {
  const key = node.key;
  const indent = '  '.repeat(depth) + '    '; 
  const specialKeys = ['wow', 'key', 'ops'];

  switch (node.type) {
    case 'added':
      return specialKeys.includes(key) ? 
        `${indent}    + ${key}: ${formatValue(node.value, depth + 1)}` : 
        `${indent}+ ${key}: ${formatValue(node.value, depth + 1)}`;
    case 'deleted':
      return specialKeys.includes(key) ? 
        `${indent}    - ${key}: ${formatValue(node.value, depth + 1)}` : 
        `${indent}- ${key}: ${formatValue(node.value, depth + 1)}`;
    case 'changed':
      return specialKeys.includes(key) ? 
        `${indent}    - ${key}: ${formatValue(node.value1, depth + 1)}\n${indent}    + ${key}: ${formatValue(node.value2, depth + 1)}` : 
        `${indent}- ${key}: ${formatValue(node.value1, depth + 1)}\n${indent}+ ${key}: ${formatValue(node.value2, depth + 1)}`;
    case 'unchanged':
      return specialKeys.includes(key) ? 
        `${indent}      ${key}: ${formatValue(node.value, depth + 1)}` : 
        `${indent}  ${key}: ${formatValue(node.value, depth + 1)}`;
    case 'nested':
      return `${indent}    ${key}: {\n${stylish(node.children, depth + 1)}\n${indent}    }`;
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
      .map(([key, val]) => `${'  '.repeat(depth) + '    '}${key}: ${formatValue(val, depth + 1)}`)
      .join('\n');
    return `{\n${formattedEntries}\n${'  '.repeat(depth)}    }`;
  }
  return value;
};

const stylish = (diff, depth = 0) => {
  const result = diff.map((child) => formatNode(child, depth)).join('\n');
  return result;
};

export { formatNode, formatValue, stylish };