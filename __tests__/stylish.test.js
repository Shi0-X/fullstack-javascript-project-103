import testDiff from './testUtils.js';
import stylishResult from '../__fixtures__/stylishResult.js';

describe('Stylish formatter', () => {
  test('should return correct diff for two JSON files', () => {
    testDiff('stylish', 'file1.json', 'file2.json', stylishResult);
  });

  test('should return correct diff for two YAML files', () => {
    testDiff('stylish', 'file1.yml', 'file2.yml', stylishResult);
  });
});