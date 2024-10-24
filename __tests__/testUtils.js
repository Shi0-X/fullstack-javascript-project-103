import path from 'path';
import genDiff from '../src/index.js';

describe('testUtils', () => {
  it('should pass', () => {
    expect(true).toBe(true);
  });
});

const getFixturePath = (filename) => path.join('__fixtures__', filename);

const testDiff = (formatter, file1, file2, expected) => {
  const result = genDiff(getFixturePath(file1), getFixturePath(file2), formatter);
  const normalizedResult = result.replace(/\s+/g, ' ').trim();
  const normalizedExpected = expected.replace(/\s+/g, ' ').trim();
  expect(normalizedResult).toEqual(normalizedExpected);
};

export default testDiff;
