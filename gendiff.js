#!/usr/bin/env node
import { Command } from 'commander';
import path from 'path';
import fs from 'fs';
import genDiff from './src/index.js'; // Importar la función genDiff

const program = new Command();

// Función para leer y analizar un archivo JSON
const parseFile = (filepath) => {
  const absolutePath = path.resolve(process.cwd(), filepath);
  const fileData = fs.readFileSync(absolutePath, 'utf-8');
  return JSON.parse(fileData);
};

program
  .description('Compares two configuration files and shows a difference.')
  .version('1.0.0')
  .arguments('<filepath1> <filepath2>')
  .option('-f, --format <type>', 'output format', 'stylish')
  .action((filepath1, filepath2, options) => {
    try {
      const file1Data = parseFile(filepath1);
      const file2Data = parseFile(filepath2);

      // Generar y mostrar las diferencias
      const diff = genDiff(file1Data, file2Data);
      console.log(diff);

    } catch (error) {
      console.error('Error reading or parsing files:', error.message);
      process.exit(1);
    }
  });

program.parse(process.argv);
