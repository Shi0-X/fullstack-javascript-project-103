// __tests__/gendiff.test.js

import genDiff from '../src/index.js';
import fs from 'fs';
import path from 'path';

// Función para obtener la ruta del archivo de prueba
const getFixturePath = (filename) => path.join(process.cwd(), filename);
const readFixture = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

describe('genDiff', () => {
  test('should return the correct diff for two JSON files', () => {
    const expected = `{
  - follow: false
  - proxy: 123.234.53.22
    host: codica.io
  - timeout: 50
  + timeout: 20
  + verbose: true
}`;
    const file1 = getFixturePath('file1.json');
    const file2 = getFixturePath('file2.json');
    
    expect(genDiff(file1, file2)).toEqual(expected);
  });

  test('should handle identical files correctly', () => {
    const identicalFile1 = getFixturePath('file1.json');
    const identicalFile2 = getFixturePath('file1.json');
    
    const expected = `{
    host: codica.io
    timeout: 50
    proxy: 123.234.53.22
    follow: false
}`;
    
    expect(genDiff(identicalFile1, identicalFile2)).toEqual(expected);
  });
});
