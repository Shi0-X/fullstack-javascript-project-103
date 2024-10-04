// __tests__/stylish.test.js
import genDiff from '../src/index.js';
import path from 'path';
import stylishResult from '../__fixtures__/stylishResult.js';

const getFixturePath = (filename) => path.join('__fixtures__', filename);

function normalizeIndentation(str) {
  return str.replace(/\s+/g, ' ').replace(/^ {4}/gm, '');
}

describe('Stylish formatter', () => {
  test('should return correct diff for two JSON files', () => {
    const file1 = getFixturePath('file1.json');
    const file2 = getFixturePath('file2.json');

    const result = genDiff(file1, file2, 'stylish');

    const normalizedResult = normalizeIndentation(result);
    const normalizedExpected = normalizeIndentation(stylishResult);

    expect(normalizedResult).toBe(normalizedExpected);
  });

  test('should return correct diff for two YAML files', () => {
    const file1 = getFixturePath('file1.yml');
    const file2 = getFixturePath('file2.yml');

    const result = genDiff(file1, file2, 'stylish');

    const normalizedResult = normalizeIndentation(result);
    const normalizedExpected = normalizeIndentation(stylishResult);

    expect(normalizedResult).toBe(normalizedExpected);
  });
});