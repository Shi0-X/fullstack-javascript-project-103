import _ from 'lodash';
// Constantes que representan los tipos de cambios en el árbol de diferencias
const ADD_VALUE = 'added'; // Valor agregado
const DELETED_VALUE = 'deleted'; // Valor eliminado
const UNCHANGED_VALUE = 'unchanged'; // Valor sin cambios
const NESTED_VALUE = 'nested'; // Valor anidado
const CHANGED_VALUE = 'changed'; // Valor cambiado
const ROOT_VALUE = 'root'; // Nodo raíz

// Función que construye la ruta completa de una propiedad, concatenando los ancestros con el nombre de la propiedad actual
const buildPropertyPath = (property, ancestors) => {
  return [...ancestors, property].join('.'); // Une los ancestros y la propiedad actual con un punto
};

// Función que formatea los valores según su tipo
const formatValue = (value) => {
  if (value === null) return value; // Si el valor es null, lo retorna como tal

  // Si el valor es un objeto, indica que es un valor complejo (como un objeto o array)
  if (_.isObject(value)) return '[complex value]';

  // Si es una cadena, la envuelve en comillas simples, si no, lo convierte en string
  return typeof value === 'string' ? `'${value}'` : String(value);
};

// Manejadores para cada tipo de nodo en el árbol de diferencias
const nodeHandlers = {
  // Maneja el caso de valores agregados
  [ADD_VALUE]: (node, path) => {
    return `Property '${buildPropertyPath(node.key, path)}' was added with value: ${formatValue(node.value)}`;
  },

  // Maneja el caso de valores cambiados
  [CHANGED_VALUE]: ({ key, value1, value2 }, path) => {
    const propertyPath = buildPropertyPath(key, path); // Construye la ruta completa de la propiedad
    return `Property '${propertyPath}' was updated. From ${formatValue(value1)} to ${formatValue(value2)}`; // Muestra los valores anterior y nuevo
  },

  // Maneja el caso de valores eliminados
  [DELETED_VALUE]: (node, path) =>
    `Property '${buildPropertyPath(node.key, path)}' was removed`,

  // Maneja nodos anidados, recorriendo sus hijos y agregando el contexto de la ruta
  [NESTED_VALUE]: ({ key, children }, path, traverse) =>
    children.flatMap((child) => {
      console.log(child, [...path, key]); // Muestra en consola el nodo hijo y su ruta acumulada
      return traverse(child, [...path, key]); // Recursivamente procesa los hijos
    }),

  // Maneja el nodo raíz, que contiene todos los nodos hijos
  [ROOT_VALUE]: ({ children }, path, traverse) =>
    children.flatMap((child) => traverse(child, path)), // Recorre todos los nodos hijos desde la raíz

  // No hace nada con los valores sin cambios, retorna un arreglo vacío
  [UNCHANGED_VALUE]: () => [],
};

// Función principal que aplica el formato "plain" al árbol de diferencias
const plain = (diff) => {
  const traverse = (node, currentPath) =>
    nodeHandlers[node.type](node, currentPath, traverse); // Llama al manejador correspondiente para cada tipo de nodo
  return traverse(diff, []).join('\n'); // Une los resultados en un string con saltos de línea
};

export default plain;