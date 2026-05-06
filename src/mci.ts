#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import { parse } from './parser';
import { computeLayout } from './layout';
import { computeRoutes } from './router';
import { generate } from './generator';
import { LinkRenderStyle } from './types';

function printUsage(): void {
  console.log('Uso: mci <arquivo-entrada.json> [--links arrows|paths]');
  console.log('');
  console.log('  Gera um arquivo HTML interativo com a matriz curricular.');
  console.log('  O arquivo de saída terá o mesmo nome do arquivo de entrada,');
  console.log('  com extensão .html, no mesmo diretório.');
  console.log('');
  console.log('  Opções:');
  console.log('    --links arrows|paths   Define o estilo visual das ligações');
  console.log('                           arrows = setas clássicas (com ponta)');
  console.log('                           paths  = caminhos estilo Sankey (padrão)');
  console.log('    -h, --help             Exibe esta ajuda');
  console.log('');
  console.log('Exemplo:');
  console.log('  node dist/mci.js examples/cdia-2026.json --links arrows');
  console.log('  => gera examples/cdia-2026.html');
}

function main(): void {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('-h') || args.includes('--help')) {
    printUsage();
    process.exit(0);
  }

  let inputArg: string | undefined;
  let linkStyle: LinkRenderStyle = 'paths';

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--links') {
      const value = args[i + 1];
      if (value !== 'arrows' && value !== 'paths') {
        console.error('Erro: --links deve ser "arrows" ou "paths".');
        process.exit(1);
      }
      linkStyle = value;
      i++;
      continue;
    }

    if (arg.startsWith('--links=')) {
      const value = arg.slice('--links='.length);
      if (value !== 'arrows' && value !== 'paths') {
        console.error('Erro: --links deve ser "arrows" ou "paths".');
        process.exit(1);
      }
      linkStyle = value;
      continue;
    }

    if (arg.startsWith('-')) {
      console.error(`Erro: opção desconhecida: ${arg}`);
      process.exit(1);
    }

    if (inputArg) {
      console.error('Erro: informe apenas um arquivo de entrada.');
      process.exit(1);
    }
    inputArg = arg;
  }

  if (!inputArg) {
    console.error('Erro: arquivo de entrada não informado.');
    printUsage();
    process.exit(1);
  }

  const inputPath = path.resolve(inputArg);

  if (!fs.existsSync(inputPath)) {
    console.error(`Erro: arquivo não encontrado: ${inputPath}`);
    process.exit(1);
  }

  const outputPath = inputPath.replace(/\.json$/i, '.html');

  let rawContent = '';
  try {
    rawContent = fs.readFileSync(inputPath, 'utf-8');
  } catch (err) {
    console.error(`Erro ao ler o arquivo: ${(err as Error).message}`);
    process.exit(1);
  }

  const curriculumFile = parse(rawContent);
  const layoutData = computeLayout(curriculumFile);
  const routeData = computeRoutes(curriculumFile, layoutData);
  const html = generate(curriculumFile, layoutData, routeData, { linkStyle });

  fs.writeFileSync(outputPath, html, 'utf-8');
  console.log(`Matriz curricular gerada: ${outputPath}`);
}

main();
