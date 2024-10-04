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

const formatNode = (node, parent) => {
  const propertyPath = parent ? `${parent}.${node.key}` : node.key;

  const formatters = {
    added: () => `Property '${propertyPath}' was added with value: ${formatValue(node.value)}`,
    deleted: () => `Property '${propertyPath}' was removed`,
    changed: () => `Property '${propertyPath}' was updated. From ${formatValue(node.value1)} to ${formatValue(node.value2)}`,
    nested: () => formatNodes(node.children, propertyPath),
    unchanged: () => [],
  };

  return formatters[node.type]();
};

const formatNodes = (nodes, parent) => {
  return nodes.flatMap((node) => formatNode(node, parent)).join('\n');
};

const plain = (diff) => {
  return formatNodes(diff);
};

export default plain;