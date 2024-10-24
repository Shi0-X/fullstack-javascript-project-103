import _ from 'lodash';

// Constantes que representan los tipos de cambios en el árbol de diferencias
const ADD_VALUE = 'added';
const DELETED_VALUE = 'deleted';
const UNCHANGED_VALUE = 'unchanged';
const NESTED_VALUE = 'nested';
const CHANGED_VALUE = 'changed';
const ROOT_VALUE = 'root';

// Función para calcular la indentación basada en la profundidad del nodo
const getIndentation = (depth, spacesCount = 4) => ' '.repeat(depth * spacesCount - 2);

// Función para formatear un valor, sea primitivo o un objeto
const formatValue = (data, depth, renderFns) => {
  if (!_.isObject(data)) return String(data);

  const entries = Object.entries(data).map(([key, value]) =>
    renderFns[UNCHANGED_VALUE]({ key, value }, depth + 1)
  );

  return `{\n${entries.join('\n')}\n${getIndentation(depth)}}`;
};

// Objeto que contiene funciones para renderizar diferentes tipos de nodos
const renderFns = {
  [ROOT_VALUE]: ({ children }, depth, iterate) => {
    const renderedChildren = children.flatMap((child) => iterate(child, depth + 1));
    return `{\n${renderedChildren.join('\n')}\n${getIndentation(depth)}}`;
  },

  [NESTED_VALUE]: ({ key, children }, depth, iterate) => {
    const nestedChildren = children.flatMap((child) => iterate(child, depth + 1));
    return `${getIndentation(depth)}  ${key}: {\n${nestedChildren.join('\n')}\n${getIndentation(depth)}  }`;
  },

  [ADD_VALUE]: (node, depth) => `${getIndentation(depth)}+ ${node.key}: ${formatValue(node.value, depth, renderFns)}`,
  [DELETED_VALUE]: (node, depth) => `${getIndentation(depth)}- ${node.key}: ${formatValue(node.value, depth, renderFns)}`,
  [UNCHANGED_VALUE]: (node, depth) => `${getIndentation(depth)}  ${node.key}: ${formatValue(node.value, depth, renderFns)}`,

  [CHANGED_VALUE]: (node, depth) => {
    const { key, value1, value2 } = node;
    const formattedValue1 = `${getIndentation(depth)}- ${key}: ${formatValue(value1, depth, renderFns)}`;
    const formattedValue2 = `${getIndentation(depth)}+ ${key}: ${formatValue(value2, depth, renderFns)}`;
    return [formattedValue1, formattedValue2].join('\n');
  },
};

// Función principal para formatear un nodo
const formatNode = (node, depth) => renderFns[node.type](node, depth, formatNode);

// Función para aplicar el formato "stylish" a un árbol de diferencias
const stylish = (diff) => formatNode(diff, 0);

// Función que envuelve la salida del formato "stylish" con llaves adicionales
const stylishWithBraces = (diff) => {
  const innerOutput = stylish(diff);
  return `{\n${innerOutput}\n${getIndentation(0)}}`;
};

export {
  formatNode,
  formatValue,
  stylish,
  stylishWithBraces,
};
