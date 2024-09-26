import genDiff from '../src/index.js';
import getFixturePath from '../src/getFixturePath.js';
import jsonResult from '../__fixtures__/jsonResult.js'; // Importamos jsonResult

// Función para realizar las pruebas con distintos formatos de archivo
const testDiff = (format) => {
  const file1 = getFixturePath(`file1.${format}`);
  const file2 = getFixturePath(`file2.${format}`);
  expect(genDiff(file1, file2, format)).toEqual(jsonResult);
};

// Prueba para archivos JSON
test('should return correct diff for two JSON files', () => {
  testDiff('json');
});

// Prueba para archivos YAML
test('should return correct diff for two YAML files', () => {
  testDiff('yml');
});
