#!/usr/bin/env node
import { Command } from 'commander';

const program = new Command();

program
  .description('Compares two configuration files and shows a difference.')
  .version('1.0.0')
  .argument('<filepath1>', 'path to the first configuration file')
  .argument('<filepath2>', 'path to the second configuration file')
  .option('-f, --format <type>', 'output format', 'stylish') // 'stylish' es el valor predeterminado
  .action((filepath1, filepath2, options) => {
    const { format } = options;

    if (!filepath1 || !filepath2) {
      console.error('Error: Both file paths must be provided.');
      process.exit(1);
    }

    // Aquí llamarías a la función genDiff cuando esté disponible.
    // const diff = genDiff(filepath1, filepath2, format);
    // console.log(diff);

    console.log(`Comparing ${filepath1} with ${filepath2}`);
    console.log(`Output format: ${format}`);
  });

program.parse(process.argv);
