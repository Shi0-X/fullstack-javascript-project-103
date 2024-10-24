import _ from 'lodash';

// Constantes que representan los tipos de cambios en el árbol de diferencias
const ADD_VALUE = 'added'; // Valor agregado
const DELETED_VALUE = 'deleted'; // Valor eliminado
const UNCHANGED_VALUE = 'unchanged'; // Valor sin cambios
const NESTED_VALUE = 'nested'; // Valor anidado
const CHANGED_VALUE = 'changed'; // Valor cambiado
const ROOT_VALUE = 'root'; // Nodo raíz

// Objeto que contiene funciones para renderizar diferentes tipos de nodos
const renderFunctions = {
  // Renderiza el nodo raíz
  [ROOT_VALUE]: ({ children }, depth, iterate) => {
    // Recorre los hijos del nodo raíz y los renderiza
    const renderedChildren = children.flatMap((child) =>
      iterate(child, depth + 1)
    );
    // Formatea el resultado como un objeto en estilo JSON
    return `{\n${renderedChildren.join('\n')}\n}`;
  },

  // Renderiza nodos anidados
  [NESTED_VALUE]: ({ key, children }, depth, iterate) => {
    // Recorre los hijos de un nodo anidado y los renderiza
    const nestedChildren = children.flatMap((child) =>
      iterate(child, depth + 1)
    );
    // Formatea la salida incluyendo el nombre de la clave y el valor anidado
    return `${getIndentation(depth)}  ${key}: {\n${nestedChildren.join('\n')}\n${getIndentation(depth)}  }`;
  },

  // Renderiza un valor agregado
  [ADD_VALUE]: (node, depth) =>
    `${getIndentation(depth)}+ ${node.key}: ${formatValue(node.value, depth, renderFunctions)}`,

  // Renderiza un valor eliminado
  [DELETED_VALUE]: (node, depth) =>
    `${getIndentation(depth)}- ${node.key}: ${formatValue(node.value, depth, renderFunctions)}`,

  // Renderiza un valor sin cambios
  [UNCHANGED_VALUE]: (node, depth) =>
    `${getIndentation(depth)}  ${node.key}: ${formatValue(node.value, depth, renderFunctions)}`,

  // Renderiza un valor que ha cambiado (muestra tanto el valor antiguo como el nuevo)
  [CHANGED_VALUE]: (node, depth) => {
    const { key, value1, value2 } = node;
    const formattedValue1 = `${getIndentation(depth)}- ${key}: ${formatValue(value1, depth, renderFunctions)}`;
    const formattedValue2 = `${getIndentation(depth)}+ ${key}: ${formatValue(value2, depth, renderFunctions)}`;
    // Retorna ambas versiones del valor en líneas separadas
    return [formattedValue1, formattedValue2].join('\n');
  },
};

// Función para calcular la indentación basada en la profundidad del nodo
const getIndentation = (depth, spacesCount = 4) =>
  ' '.repeat(depth * spacesCount - 2); // Restar 2 para alinear los símbolos correctamente

// Función para formatear un valor, sea primitivo o un objeto
const formatValue = (data, depth, renderFunctions) => {
  // Si el valor no es un objeto, retorna su representación como string
  if (!_.isObject(data)) return String(data);

  // Si es un objeto, recorre cada par clave-valor y los renderiza como si fueran "sin cambios"
  const entries = Object.entries(data).map(([key, value]) =>
    renderFunctions[UNCHANGED_VALUE]({ key, value }, depth + 1)
  );

  // Retorna el objeto formateado con indentación y saltos de línea
  return `{\n${entries.join('\n')}\n${getIndentation(depth)}  }`;
};

// Función principal para formatear un nodo
const formatNode = (node, depth) =>
  renderFunctions[node.type](node, depth, formatNode);

// Función para aplicar el formato "stylish" a un árbol de diferencias
const stylish = (diff) => {
  return formatNode(diff, 0); // Retorna el nodo formateado
};

// Función que envuelve la salida del formato "stylish" con llaves adicionales
const stylishWithBraces = (diff) => {
  const innerOutput = stylish(diff);
  return `{\n${innerOutput}\n}`; // Envuelve el resultado dentro de un bloque de llaves
};

export { formatNode, formatValue, stylish, stylishWithBraces };