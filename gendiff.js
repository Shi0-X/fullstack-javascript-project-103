// gendiff.js

import { Command } from 'commander';
import genDiff, { formatDiff } from './src/index.js'; // Importar genDiff como exportación por defecto

const program = new Command();

program
  .version('1.0.0')
  .description('Generate a difference between two JSON/YAML files')
  .argument('<filepath1>', 'path to first file')
  .argument('<filepath2>', 'path to second file')
  .action((filepath1, filepath2) => {
    const diff = genDiff(filepath1, filepath2);
    const result = formatDiff(diff); // Usar la función de formateo
    console.log(result);
  });

program.parse(process.argv);
