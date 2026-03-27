#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import { parse } from './parser';
import { computeLayout } from './layout';
import { computeRoutes } from './router';
import { generate } from './generator';

function printUsage(): void {
  console.log('Uso: mci <arquivo-entrada.json>');
  console.log('');
  console.log('  Gera um arquivo HTML interativo com a matriz curricular.');
  console.log('  O arquivo de saída terá o mesmo nome do arquivo de entrada,');
  console.log('  com extensão .html, no mesmo diretório.');
  console.log('');
  console.log('Exemplo:');
  console.log('  node dist/mci.js examples/cdia-2026.json');
  console.log('  => gera examples/cdia-2026.html');
}

function main(): void {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    printUsage();
    process.exit(0);
  }

  const inputPath = path.resolve(args[0]);

  if (!fs.existsSync(inputPath)) {
    console.error(`Erro: arquivo não encontrado: ${inputPath}`);
    process.exit(1);
  }

  const outputPath = inputPath.replace(/\.json$/i, '.html');

  let rawContent: string;
  try {
    rawContent = fs.readFileSync(inputPath, 'utf-8');
  } catch (err) {
    console.error(`Erro ao ler o arquivo: ${(err as Error).message}`);
    process.exit(1);
  }

  const curriculumFile = parse(rawContent);
  const layoutData = computeLayout(curriculumFile);
  const routeData = computeRoutes(curriculumFile, layoutData);
  const html = generate(curriculumFile, layoutData, routeData);

  fs.writeFileSync(outputPath, html, 'utf-8');
  console.log(`Matriz curricular gerada: ${outputPath}`);
}

main();
