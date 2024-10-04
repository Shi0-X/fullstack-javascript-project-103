// __tests__/plain.test.js
import genDiff from '../src/index.js';
import fs from 'fs';
import path from 'path';
import plainResult from '../__fixtures__/plainResult.js'; // Importa el mock

const getFixturePath = (filename) => path.join('__fixtures__', filename);

describe('Plain formatter', () => {
  test('should return correct diff for two JSON files', () => {
    const file1 = getFixturePath('file1.json');
    const file2 = getFixturePath('file2.json');

    const result = genDiff(file1, file2, 'plain'); // Asegúrate de usar 'plain' aquí
    expect(result).toBe(plainResult.trim()); // Utiliza el mock aquí
  });

  test('should return correct diff for two YAML files', () => {
    const file1 = getFixturePath('file1.yml');
    const file2 = getFixturePath('file2.yml');

    const result = genDiff(file1, file2, 'plain'); // Asegúrate de usar 'plain' aquí
    expect(result).toBe(plainResult.trim()); // Utiliza el mock aquí
  });
});
