import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Lista de diretórios para copiar
const dirsToCopy = [
  'journeys',
  'quizzes',
  'data',
  'anamnese',
  'assets'
];

// Limpa o diretório public
fs.emptyDirSync('public');

// Copia os diretórios
dirsToCopy.forEach(dir => {
  if (fs.existsSync(dir)) {
    fs.copySync(dir, path.join('public', dir));
  }
});
