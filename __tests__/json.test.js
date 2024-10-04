// __tests__/formatters/json.test.js

import json from '../src/formatters/json.js';

describe('JSON Formatter', () => {
  it('debería retornar una cadena', () => {
    const jsonResult = {
      key1: 'valor1',
      key2: 'valor2',
    };
    const result = json(JSON.stringify(jsonResult));
    expect(typeof result).toBe('string');
  });

  it('debería contener las claves esperadas', () => {
    const jsonResult = {
      key1: 'valor1',
      key2: 'valor2',
    };
    const result = json(JSON.stringify(jsonResult));
    const parsedResult = JSON.parse(result);
    expect(parsedResult).toHaveProperty('key1');
    expect(parsedResult).toHaveProperty('key2');
  });
});