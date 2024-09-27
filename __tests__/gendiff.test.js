import genDiff from '../src/index.js';
import getFixturePath from '../src/getFixturePath.js';
import jsonResult from '../__fixtures__/jsonResult.js';

const testDiff = (format) => {
  const file1 = getFixturePath(`file1.${format}`);
  const file2 = getFixturePath(`file2.${format}`);
  const result = genDiff(file1, file2, format);

  // Asegúrate de que `jsonResult` y el resultado de la función `genDiff` tengan una estructura comparable
  const normalizedResult = { type: 'root', children: result };

  expect(normalizedResult).toEqual(jsonResult);
};

// Prueba para archivos JSON
test('should return correct diff for two JSON files', () => {
  testDiff('json');
});

// Prueba para archivos YAML
test('should return correct diff for two YAML files', () => {
  testDiff('yml');
});
