import testDiff from './testUtils.js';
import plainResult from '../__fixtures__/plainResult.js';

describe('Plain formatter', () => {
  test('should return correct diff for two JSON files', () => {
    testDiff('plain', 'file1.json', 'file2.json', plainResult);
  });

  test('should return correct diff for two YAML files', () => {
    testDiff('plain', 'file1.yml', 'file2.yml', plainResult);
  });
});