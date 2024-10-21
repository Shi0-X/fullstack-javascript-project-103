import _ from 'lodash';

const ADD_VALUE = 'added';
const DELETED_VALUE = 'deleted';
const UNCHANGED_VALUE = 'unchanged';
const NESTED_VALUE = 'nested';
const CHANGED_VALUE = 'changed';
const ROOT_VALUE = 'root';

const renderFunctions = {
  [ROOT_VALUE]: ({ children }, depth, iterate) => {
    const renderedChildren = children.flatMap((child) =>
      iterate(child, depth + 1)
    );
    return `{\n${renderedChildren.join('\n')}\n}`;
  },

  [NESTED_VALUE]: ({ key, children }, depth, iterate) => {
    const nestedChildren = children.flatMap((child) =>
      iterate(child, depth + 1)
    );
    return `${getIndentation(depth)}  ${key}: {\n${nestedChildren.join('\n')}\n${getIndentation(depth)}  }`;
  },

  [ADD_VALUE]: (node, depth) =>
    `${getIndentation(depth)}+ ${node.key}: ${formatValue(node.value, depth, renderFunctions)}`,

  [DELETED_VALUE]: (node, depth) =>
    `${getIndentation(depth)}- ${node.key}: ${formatValue(node.value, depth, renderFunctions)}`,

  [UNCHANGED_VALUE]: (node, depth) =>
    `${getIndentation(depth)}  ${node.key}: ${formatValue(node.value, depth, renderFunctions)}`,

  [CHANGED_VALUE]: (node, depth) => {
    const { key, value1, value2 } = node;
    const formattedValue1 = `${getIndentation(depth)}- ${key}: ${formatValue(value1, depth, renderFunctions)}`;
    const formattedValue2 = `${getIndentation(depth)}+ ${key}: ${formatValue(value2, depth, renderFunctions)}`;
    return [formattedValue1, formattedValue2].join('\n');
  },
};

const getIndentation = (depth, spacesCount = 4) =>
  ' '.repeat(depth * spacesCount - 2);

const formatValue = (data, depth, renderFunctions) => {
  if (!_.isObject(data)) return String(data);

  const entries = Object.entries(data).map(([key, value]) =>
    renderFunctions[UNCHANGED_VALUE]({ key, value }, depth + 1)
  );

  return `{\n${entries.join('\n')}\n${getIndentation(depth)}  }`;
};

const formatNode = (node, depth) =>
  renderFunctions[node.type](node, depth, formatNode);

const stylish = (diff) => {
  return formatNode(diff, 0);
};

const stylishWithBraces = (diff) => {
  const innerOutput = stylish(diff);
  return `{\n${innerOutput}\n}`;
};

export { formatNode, formatValue, stylish, stylishWithBraces };