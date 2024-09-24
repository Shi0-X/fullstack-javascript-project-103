import pkg from 'json5';
const { parse } = pkg;
import fs from 'fs';
import path from 'path';

// Función para leer y parsear el contenido del archivo
const getData = (filepath) => {
  const absolutePath = path.resolve(filepath);
  const data = fs.readFileSync(absolutePath, 'utf-8');
  return parse(data);
};

// Función recursiva para generar diferencias
const buildDiff = (data1, data2) => {
  const keys = Array.from(new Set([...Object.keys(data1), ...Object.keys(data2)]));

  return keys.sort().map((key) => {
    if (!(key in data1)) {
      return { key, type: 'added', value: data2[key] };
    }
    if (!(key in data2)) {
      return { key, type: 'deleted', value: data1[key] };
    }
    if (data1[key] !== data2[key]) {
      // Si ambos valores son objetos, llamamos a la función recursiva
      if (typeof data1[key] === 'object' && data1[key] !== null && typeof data2[key] === 'object' && data2[key] !== null) {
        return { key, type: 'nested', children: buildDiff(data1[key], data2[key]) };
      }
      return { key, type: 'changed', value1: data1[key], value2: data2[key] };
    }
    return { key, type: 'unchanged', value: data1[key] };
  });
};

// Función para generar la diferencia entre dos archivos
const genDiff = (file1Path, file2Path) => {
  const data1 = getData(file1Path);
  const data2 = getData(file2Path);

  console.log('Data 1:', data1); // Imprime los datos del primer archivo
  console.log('Data 2:', data2); // Imprime los datos del segundo archivo

  const diff = {
    type: 'root',
    children: buildDiff(data1, data2)
  };

  console.log('Diff:', diff); // Imprime la diferencia generada
  return diff; // Retornar el resultado como objeto
};

export default genDiff;
