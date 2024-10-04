const stylish = (diff, depth = 1) => {
  const indent = '    '.repeat(depth);

  const formatNode = (node, depth) => {
    const key = node.key;

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

  const result = diff.map((child) => formatNode(child, depth)).join('\n');
  return result;
};

const formatValue = (value, depth) => {
  if (value === null) {
    return 'null'; // Manejar null
  }
  if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
    const formattedEntries = Object.entries(value)
      .map(([key, val]) => `${'    '.repeat(depth + 1)}${key}: ${formatValue(val, depth + 1)}`)
      .join('\n');
    return `{\n${formattedEntries}\n${'    '.repeat(depth)}}`;
  }
  return value; // Para tipos primitivos como strings, números, booleans
};

// Función que añade llaves al inicio y al final
const stylishWithBraces = (diff) => {
  const innerOutput = stylish(diff);
  return `{\n${innerOutput}\n}`; // Añadiendo llaves alrededor del resultado
};

// Exportar la función como exportación por defecto
export default stylishWithBraces;
