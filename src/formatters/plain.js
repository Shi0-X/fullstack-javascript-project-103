import _ from 'lodash';

const ADD_VALUE = 'added';
const DELETED_VALUE = 'deleted';
const UNCHANGED_VALUE = 'unchanged';
const NESTED_VALUE = 'nested';
const CHANGED_VALUE = 'changed';
const ROOT_VALUE = 'root';

const buildPropertyPath = (property, ancestors) => [...ancestors, property].join('.');

const formatValue = (value) => {
  if (value === null) return value;
  if (_.isObject(value)) return '[complex value]';
  return typeof value === 'string' ? `'${value}'` : String(value);
};

const nodeHandlers = {
  [ADD_VALUE]: ((node, path) => {
    const propertyPath = buildPropertyPath(node.key, path);
    return `Property '${propertyPath}' was added with value: ${formatValue(node.value)}`;
  }),
  [CHANGED_VALUE]: (({ key, value1, value2 }, path) => {
    const propertyPath = buildPropertyPath(key, path);
    return `Property '${propertyPath}' was updated. From ${formatValue(value1)} to ${formatValue(value2)}`;
  }),
  [DELETED_VALUE]: ((node, path) => {
    const propertyPath = buildPropertyPath(node.key, path);
    return `Property '${propertyPath}' was removed`;
  }),
  [NESTED_VALUE]: (({ key, children }, path, traverse) =>
    children.flatMap((child) => traverse(child, [...path, key]))
  ),
  [ROOT_VALUE]: (({ children }, path, traverse) =>
    children.flatMap((child) => traverse(child, path))
  ),
  [UNCHANGED_VALUE]: (() => []),
};

const plain = ((diff) => {
  const traverse = ((node, currentPath) =>
    nodeHandlers[node.type](node, currentPath, traverse)
  );
  return traverse(diff, []).join('\n');
});

export default plain;
