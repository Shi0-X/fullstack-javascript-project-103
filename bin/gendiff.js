import { Command } from 'commander';
import genDiff from '../src/index.js'; // Importando genDiff desde src

const program = new Command();

program
  .version('1.0.0')
  .description('Compares two configuration files and shows a difference.')
  .argument('<file1>', 'first configuration file')
  .argument('<file2>', 'second configuration file')
  .option('-f, --format <type>', 'output format (default: stylish)', 'stylish')
  .action((file1, file2, options) => {
    const diff = genDiff(file1, file2, options.format); // Pasar el formato aquí
    console.log(diff); // No necesitamos el método formatDiff
  });

program.parse(process.argv);
