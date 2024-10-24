import fs from 'fs';
import path from 'path';
import YAML from 'yaml';
import formatDiff from './formatters/index.js';
// import { stylish } from './utils.js';

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

// Reemplazamos el sort con un enfoque basado en reduce
const sortedKeys = (data1, data2) => {
  const keys = [...new Set([...Object.keys(data1), ...Object.keys(data2)])];
  return keys.reduce((acc, key) => {
    let i = 0;
    while (i < acc.length && acc[i] < key) {
      i += 1;
    }
    return [...acc.slice(0, i), key, ...acc.slice(i)];
  }, []);
};

const buildDiff = (data1, data2) => {
  const keys = sortedKeys(data1, data2);

  return keys.map((key) => {
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
      return {
        key, type: 'changed', value1: data1[key], value2: data2[key],
      };
    }
    return { key, type: 'unchanged', value: data1[key] };
  });
};

// const stylishWithBraces = (diff) => {
//  const innerOutput = stylish(diff);
//  return `{\n${innerOutput}\n}`;
// };

const genDiff = (file1Path, file2Path, format = 'stylish') => {
  const data1 = parseFile(file1Path);
  const data2 = parseFile(file2Path);
  const diff = {
    type: 'root',
    children: buildDiff(data1, data2),
  };

  return formatDiff(diff, format);
};

export default genDiff;
