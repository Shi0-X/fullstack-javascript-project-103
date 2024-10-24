import fs from 'fs';
import getPath from '../src/getFixturePath.js';
import genDiff from '../src/index.js';

const stylishResult = fs.readFileSync(getPath('stylish-result.txt'), 'utf8');
const plainResult = fs.readFileSync(getPath('plain-result.txt'), 'utf8');
const jsonResult = JSON.parse(fs.readFileSync(getPath('json-result.json'), 'utf8'));

const generateFilePaths = (filename1, filename2, extension) => [
  getPath(`${filename1}.${extension}`),
  getPath(`${filename2}.${extension}`),
];

const testGenDiff = (filepath1, filepath2, format, expectedResult) => {
  expect(genDiff(filepath1, filepath2, format)).toBe(expectedResult);
};

const testGenDiffJSON = (filepath1, filepath2, expectedResult) => {
  expect(JSON.parse(genDiff(filepath1, filepath2, 'json'))).toEqual(expectedResult);
};

test('Format for stylish Result - YAML File', () => {
  const [filepath1, filepath2] = generateFilePaths('file1-y', 'file2-y', 'yaml');
  testGenDiff(filepath1, filepath2, 'stylish', stylishResult);
});

test('Format for plain Result - YAML File', () => {
  const [filepath1, filepath2] = generateFilePaths('file1-y', 'file2-y', 'yaml');
  testGenDiff(filepath1, filepath2, 'plain', plainResult);
});

test('Format for JSON Result - JSON File', () => {
  const [filepath1, filepath2] = generateFilePaths('file1', 'file2', 'json');
  testGenDiffJSON(filepath1, filepath2, jsonResult);
});
