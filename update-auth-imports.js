/**
 * Script para atualizar todas as importações do useAuth para useCustomAuth
 * Este script deve ser executado na raiz do projeto
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Obter o diretório atual em ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Diretório raiz para busca
const rootDir = path.join(__dirname, 'src');

// Padrões de importação a serem substituídos
const importPatterns = [
  {
    from: "import { useAuth } from '@/hooks/useAuth';",
    to: "import { useCustomAuth as useAuth } from '@/hooks/useCustomAuth';"
  },
  {
    from: "import { useAuth } from '@/providers/AuthProvider';",
    to: "import { useCustomAuth as useAuth } from '@/hooks/useCustomAuth';"
  },
  {
    from: "import { useAuth } from './useAuth';",
    to: "import { useCustomAuth as useAuth } from '@/hooks/useCustomAuth';"
  }
];

// Contador de arquivos atualizados
let updatedFiles = 0;

/**
 * Processa um arquivo para substituir as importações
 * @param {string} filePath Caminho do arquivo
 */
function processFile(filePath) {
  // Verificar se é um arquivo TypeScript/JavaScript/TSX/JSX
  if (!/\.(ts|tsx|js|jsx)$/.test(filePath)) {
    return;
  }

  try {
    // Ler o conteúdo do arquivo
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    let updated = false;

    // Aplicar todas as substituições
    for (const pattern of importPatterns) {
      if (content.includes(pattern.from)) {
        content = content.replace(pattern.from, pattern.to);
        updated = true;
      }
    }

    // Se houve alterações, salvar o arquivo
    if (updated) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Atualizado: ${filePath}`);
      updatedFiles++;
    }
  } catch (error) {
    console.error(`Erro ao processar ${filePath}:`, error);
  }
}

/**
 * Percorre recursivamente os diretórios
 * @param {string} dir Diretório a ser percorrido
 */
function traverseDirectory(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // Recursivamente percorrer subdiretórios
      traverseDirectory(fullPath);
    } else {
      // Processar arquivo
      processFile(fullPath);
    }
  }
}

console.log('Iniciando atualização de importações...');
traverseDirectory(rootDir);
console.log(`Concluído! ${updatedFiles} arquivos foram atualizados.`);
