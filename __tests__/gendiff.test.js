import genDiff from '../src/index.js'; 
import getFixturePath from '../src/getFixturePath.js';
import jsonResult from '../__fixtures__/jsonResult.js'; // Importamos jsonResult

test('should return correct diff for two JSON files', () => {
  const file1 = getFixturePath('file1.json');
  const file2 = getFixturePath('file2.json');
  expect(genDiff(file1, file2, 'json')).toEqual(jsonResult);
});
