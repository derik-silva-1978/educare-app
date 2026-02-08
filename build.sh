#!/bin/bash
set -e

echo "============================================"
echo "  Educare+ — Build de Imagens Docker"
echo "============================================"
echo ""

VITE_API_URL="${VITE_API_URL:-https://api.educareapp.com.br}"

echo ">> VITE_API_URL: $VITE_API_URL"
echo ""

echo "[1/2] Compilando imagem do Backend..."
docker build -t educare-backend:latest -f Dockerfile.backend .
echo "      ✔ educare-backend:latest pronta"
echo ""

echo "[2/2] Compilando imagem do Frontend..."
docker build -t educare-frontend:latest \
  --build-arg VITE_API_URL="$VITE_API_URL" \
  -f Dockerfile.frontend .
echo "      ✔ educare-frontend:latest pronta"
echo ""

echo "============================================"
echo "  Build concluído com sucesso!"
echo "============================================"
echo ""
echo "Imagens disponíveis:"
docker images | grep educare
echo ""
echo "Próximo passo:"
echo "  → No Portainer, faça deploy do Stack"
echo "    usando o docker-compose.yml"
echo ""
