import fs from 'fs';
import getPath from '../src/getFixturePath.js';
import genDiff from '../src/index.js';

const stylishResult = fs.readFileSync(getPath('stylish-result.txt'), 'utf8');
const plainResult = fs.readFileSync(getPath('plain-result.txt'), 'utf8');
const jsonResult = JSON.parse(fs.readFileSync(getPath('json-result.json'), 'utf8'));

test('Format for stylish Result - YAML File', () => {
  const filepath1 = getPath('file1-y.yaml');
  const filepath2 = getPath('file2-y.yaml');
  expect(genDiff(filepath1, filepath2, 'stylish')).toBe(stylishResult);
});

test('Format for plain Result - YAML File', () => {
  const filepath1 = getPath('file1-y.yaml');
  const filepath2 = getPath('file2-y.yaml');
  expect(genDiff(filepath1, filepath2, 'plain')).toBe(plainResult);
});

test('Format for JSON Result - JSON File', () => {
  const filepath1 = getPath('file1.json');
  const filepath2 = getPath('file2.json');
  expect(JSON.parse(genDiff(filepath1, filepath2, 'json'))).toEqual(jsonResult);
});
