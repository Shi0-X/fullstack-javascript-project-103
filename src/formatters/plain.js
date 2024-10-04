// formatters/plain.js

const formatValue = (value) => {
  if (value === null) {
    return null;
  }
  if (typeof value === 'object' && value !== null) {
    return '[complex value]';
  }
  return typeof value === 'string' ? `'${value}'` : value;
};

const plain = (diff) => {
  const iter = (nodes, parent = '') => {
    return nodes
      .flatMap((node) => {
        const propertyPath = parent ? `${parent}.${node.key}` : node.key;

        switch (node.type) {
        case 'added':
          return `Property '${propertyPath}' was added with value: ${formatValue(node.value)}`;
        case 'deleted':
          return `Property '${propertyPath}' was removed`;
        case 'changed':
          return `Property '${propertyPath}' was updated. From ${formatValue(node.value1)} to ${formatValue(node.value2)}`;
        case 'nested':
          return iter(node.children, propertyPath);
        case 'unchanged':
          return [];
        default:
          throw new Error(`Unknown node type: ${node.type}`);
        }
      })
      .join('\n');
  };

  return iter(diff);
};

export default plain;
