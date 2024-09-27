import { Command } from 'commander';
import genDiff from './src/index.js';
import stylish from './src/stylish.js';

const program = new Command();

program
  .version('1.0.0')
  .argument('<file1>', 'first configuration file')
  .argument('<file2>', 'second configuration file')
  .option('-f, --format <type>', 'output format (default: stylish)', 'stylish')
  .action((file1, file2, options) => {
    const diff = genDiff(file1, file2);
    const output = formatDiff(diff, options.format);
    console.log(output);
  });

const formatDiff = (diff, format) => {
  switch (format) {
  case 'stylish':
    return stylish(diff);
    // Otros formatos pueden ir aquí
  default:
    return `Error: El formato '${format}' no es válido. Por favor, use uno definido.`;
  }
};

program.parse(process.argv);
