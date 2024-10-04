import fs from 'fs';
import path from 'path';
import YAML from 'yaml';
import formatDiff from './formatters/index.js';
import { formatNode, formatValue, stylish } from './utils.js';

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
    let result;

    if (!(key in data1)) {
      result = { key, type: 'added', value: data2[key] };
    } else if (!(key in data2)) {
      result = { key, type: 'deleted', value: data1[key] };
    } else if (data1[key] !== data2[key]) {
      if (typeof data1[key] === 'object' && data1[key] !== null && typeof data2[key] === 'object' && data2[key] !== null) {
        result = { key, type: 'nested', children: buildDiff(data1[key], data2[key]) };
      } else {
        result = { key, type: 'changed', value1: data1[key], value2: data2[key] };
      }
    } else {
      result = { key, type: 'unchanged', value: data1[key] };
    }

    return result;
  });
};

const stylishWithBraces = (diff) => {
  const innerOutput = stylish(diff);
  return `{\n${innerOutput}\n}`;
};

const genDiff = (file1Path, file2Path, format = 'stylish') => {
  const data1 = parseFile(file1Path);
  const data2 = parseFile(file2Path);
  const diff = buildDiff(data1, data2);

  return formatDiff(diff, format);
};

export default genDiff;