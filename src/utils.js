const formatNode = (node, depth) => {
  const key = node.key;

  switch (node.type) {
  case 'added':
    return `${'    '.repeat(depth)}+ ${key}: ${formatValue(node.value, depth)}`;
  case 'deleted':
    return `${'    '.repeat(depth)}- ${key}: ${formatValue(node.value, depth)}`;
  case 'changed':
    return `${'    '.repeat(depth)}- ${key}: ${formatValue(node.value1, depth)}\n${'    '.repeat(depth)}+ ${key}: ${formatValue(node.value2, depth)}`;
  case 'unchanged':
    return `${'    '.repeat(depth)}  ${key}: ${formatValue(node.value, depth)}`;
  case 'nested':
    return `${'    '.repeat(depth)}  ${key}: {\n${stylish(node.children, depth + 1)}\n${'    '.repeat(depth)}  }`;
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
      .map(([key, val]) => `${'    '.repeat(depth + 1)}${key}: ${formatValue(val, depth + 1)}`)
      .join('\n');
    return `{\n${formattedEntries}\n${'    '.repeat(depth)}}`;
  }
  return value;
};

const stylish = (diff, depth = 1) => {
  const indent = '    '.repeat(depth);
  const result = diff.map((child) => formatNode(child, depth)).join('\n');
  return result;
};

export { formatNode, formatValue, stylish };