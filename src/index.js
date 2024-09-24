// src/index.js

import pkg from 'json5';
const { parse } = pkg;
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

// Función para leer y parsear el contenido del archivo
const getData = (filepath) => {
  const absolutePath = path.resolve(filepath);
  const extname = path.extname(absolutePath);
  const data = fs.readFileSync(absolutePath, 'utf-8');

  switch (extname) {
    case '.json':
      return JSON.parse(data);
    case '.yml':
    case '.yaml':
      return yaml.load(data);
    default:
      throw new Error(`Unsupported file format: ${extname}`);
  }
};

// Función recursiva para generar diferencias
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

// Función para generar la diferencia entre dos archivos
const genDiff = (file1Path, file2Path) => {
  const data1 = getData(file1Path);
  const data2 = getData(file2Path);

  const diff = {
    type: 'root',
    children: buildDiff(data1, data2),
  };

  return diff;
};

// Nueva función para formatear la salida
const formatDiff = (diff) => {
  return diff.children.map((node) => {
    switch (node.type) {
      case 'added':
        return `  + ${node.key}: ${node.value}`;
      case 'deleted':
        return `  - ${node.key}: ${node.value}`;
      case 'changed':
        return `  - ${node.key}: ${node.value1}\n  + ${node.key}: ${node.value2}`;
      case 'unchanged':
        return `    ${node.key}: ${node.value}`;
      case 'nested':
        return `    ${node.key}: { ${formatDiff(node)} }`;
      default:
        return '';
    }
  }).join('\n');
};

// Exportar la función genDiff como exportación por defecto y la función formatDiff como exportación nombrada
export default genDiff;
export { formatDiff };

// Lógica para ejecutar el script directamente
if (import.meta.url === 'file://' + process.argv[1]) {
  const [file1, file2] = process.argv.slice(2);
  const diff = genDiff(file1, file2);
  console.log(formatDiff(diff));
}
