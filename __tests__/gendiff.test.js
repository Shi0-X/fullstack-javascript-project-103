import genDiff from '../src/index.js'; // Asegúrate de que esta importación sea correcta
import getFixturePath from '../src/getFixturePath.js'; // Importar correctamente la función
import jsonResult from '../__fixtures__/jsonResult.js';

const testDiffFunc = (format) => {
  const file1 = getFixturePath(`file1.${format}`);
  const file2 = getFixturePath(`file2.${format}`);
  const result = genDiff(file1, file2); // Llamamos sin formato para usar el predeterminado

  // Asegúrate de que `jsonResult` y el resultado de la función `genDiff` tengan una estructura comparable
  const normalizedResult = { type: 'root', children: result };

  // Comparar el resultado normalizado con el resultado esperado
  expect(normalizedResult).toEqual(jsonResult);
};

// Prueba para archivos JSON
test('should return correct diff for two JSON files', () => {
  testDiffFunc('json');
});

// Prueba para archivos YAML
test('should return correct diff for two YAML files', () => {
  testDiffFunc('yml');
});
