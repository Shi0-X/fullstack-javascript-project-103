import { Command } from 'commander';
import genDiff from './src/index.js';

const program = new Command();

program
  .version('1.0.0')
  .description('Generate a difference between two JSON/YAML files')
  .argument('<filepath1>', 'path to first file')
  .argument('<filepath2>', 'path to second file')
  .action((filepath1, filepath2) => {
    const result = genDiff(filepath1, filepath2);
    console.log(result);
  });

program.parse(process.argv);
