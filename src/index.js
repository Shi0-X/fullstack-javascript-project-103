/* eslint-env node */

import fs from 'fs';
import path from 'path';
import _ from 'lodash';

// Función para leer y parsear un archivo JSON
const parseJSON = (filepath) => {
  const fullPath = path.resolve(process.cwd(), filepath);
  const data = fs.readFileSync(fullPath, 'utf-8');
  return JSON.parse(data);
};

// Función para generar el diff entre dos archivos JSON
const genDiff = (filepath1, filepath2) => {
  const data1 = parseJSON(filepath1);
  const data2 = parseJSON(filepath2);

  // Obtener las claves únicas ordenadas alfabéticamente
  const allKeys = _.sortBy(_.union(
    _.keys(data1), _.keys(data2),
  ));

  const result = allKeys.map((key) => {
    if (!_.has(data2, key)) {
      return `  - ${key}: ${data1[key]}`; // Clave solo en el archivo 1
    }
    if (!_.has(data1, key)) {
      return `  + ${key}: ${data2[key]}`; // Clave solo en el archivo 2
    }
    if (data1[key] !== data2[key]) {
      return [
        `  - ${key}: ${data1[key]}`,
        `  + ${key}: ${data2[key]}`,
      ].join('\n');
    }
    return `    ${key}: ${data1[key]}`;
  });

  return `{\n${result.join('\n')}\n}`;
};

export default genDiff;
