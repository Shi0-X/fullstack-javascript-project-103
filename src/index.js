import fs from 'fs';
import path from 'path';
import YAML from 'yaml';
import formatDiff from './formatters/index.js'; // Importar los formateadores

const determineFormat = (filePath) => {
  const ext = path.extname(filePath).slice(1);
  if (ext === 'json' || ext === 'yaml' || ext === 'yml') {
    return ext;
  }
  throw new Error(`Unsupported file format: ${ext}`);
};

const parseFile = (filePath) => {
  const format = determineFormat(filePath);
  const content = fs.readFileSync(filePath, 'utf-8');

  if (format === 'json') {
    return JSON.parse(content);
  }
  if (format === 'yaml' || format === 'yml') {
    return YAML.parse(content);
  }

  return null;
};

const buildDiff = (data1, data2) => {
  const keys = Array.from(new Set([...Object.keys(data1), ...Object.keys(data2)]));

  return keys.sort().map((key) => {
    if (!(key in data1)) {
      return { key, type: 'added', value: data2[key] };
    }
    if (!(key in data2)) {
      return { key, type: 'deleted', value: data1[key] };
    }
    if (data1[key] !== data2[key]) {
      if (typeof data1[key] === 'object' && data1[key] !== null && typeof data2[key] === 'object' && data2[key] !== null) {
        return { key, type: 'nested', children: buildDiff(data1[key], data2[key]) };
      }
      return { key, type: 'changed', value1: data1[key], value2: data2[key] };
    }
    return { key, type: 'unchanged', value: data1[key] };
  });
};

const stylish = (diff, depth = 1) => {
  const indent = '    '.repeat(depth);

  const formatNode = (node) => {
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

  const result = diff.map((child) => formatNode(child)).join('\n');
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

// Modificamos `genDiff` para soportar el formato
const genDiff = (file1Path, file2Path, format = 'stylish') => {
  const data1 = parseFile(file1Path);
  const data2 = parseFile(file2Path);
  const diff = buildDiff(data1, data2);

  return formatDiff(diff, format); // Aplicamos el formateador correcto
};

export default genDiff;
