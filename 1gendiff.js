#!/usr/bin/env node

import { genDiff } from './src/index.js'; // Asegúrate de que la ruta es correcta
import getFixturePath from './__tests__/getFixturePath.js';

const [,, file1, file2] = process.argv; // Captura los argumentos de línea de comandos

if (!file1 || !file2) {
    console.error('Please provide two file paths.');
    process.exit(1);
}

const result = genDiff(getFixturePath(file1), getFixturePath(file2));
console.log(result);
