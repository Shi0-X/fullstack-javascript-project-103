const genDiff = (data1, data2) => {
  const keys = new Set([...Object.keys(data1), ...Object.keys(data2)]);
  const result = [];

  keys.forEach((key) => {
    if (!Object.hasOwn(data2, key)) {
      result.push(`  - ${key}: ${data1[key]}`); // Clave eliminada
    } else if (!Object.hasOwn(data1, key)) {
      result.push(`  + ${key}: ${data2[key]}`); // Clave añadida
    } else if (data1[key] !== data2[key]) {
      result.push(`  - ${key}: ${data1[key]}`); // Clave modificada
      result.push(`  + ${key}: ${data2[key]}`); // Nuevo valor
    } else {
      result.push(`    ${key}: ${data1[key]}`); // Sin cambios
    }
  });

  return `{\n${result.join('\n')}\n}`;
};

export default genDiff;
