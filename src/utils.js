const formatNode = (node, depth) => {
  const key = node.key;
  const indent = '  '.repeat(depth + 2); // Aumenta la indentación en 2 niveles

  switch (node.type) {
    case 'added':
      return `${indent}+ ${key}: ${formatValue(node.value, depth + 2)}`;
    case 'deleted':
      return `${indent}- ${key}: ${formatValue(node.value, depth + 2)}`;
    case 'changed':
      return `${indent}- ${key}: ${formatValue(node.value1, depth + 2)}\n${indent}+ ${key}: ${formatValue(node.value2, depth + 2)}`;
    case 'unchanged':
      return `${indent}  ${key}: ${formatValue(node.value, depth + 2)}`;
    case 'nested':
      return `${indent}  ${key}: {\n${stylish(node.children, depth + 2)}\n${indent}  }`;
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
      .map(([key, val]) => `${'  '.repeat(depth + 2)}${key}: ${formatValue(val, depth + 2)}`)
      .join('\n');
    return `{\n${formattedEntries}\n${'  '.repeat(depth + 1)}  }`;
  }
  return value;
};

const stylish = (diff, depth = 0) => {
  const result = diff.map((child) => formatNode(child, depth)).join('\n');
  return result;
};

export { formatNode, formatValue, stylish };