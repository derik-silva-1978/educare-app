#!/bin/bash

echo "🧪 Teste de Validação de Quiz - TitiNauta"
echo "======================================="

# Verificar se o servidor está rodando
echo "1. Verificando se o servidor está ativo..."
curl -s http://localhost:8000 > /dev/null
if [ $? -eq 0 ]; then
    echo "✅ Servidor está rodando na porta 8000"
else
    echo "❌ Servidor não está rodando"
    exit 1
fi

# Verificar se os arquivos JavaScript existem e estão corretos
echo "2. Verificando estrutura dos arquivos..."
if [ -f "/workspaces/Titinauta/index.js" ]; then
    echo "✅ index.js encontrado"
else
    echo "❌ index.js não encontrado"
    exit 1
fi

# Verificar se as funções de validação foram adicionadas
echo "3. Verificando se as funções de validação estão presentes..."
if grep -q "_showValidationError" /workspaces/Titinauta/index.js; then
    echo "✅ Função _showValidationError encontrada"
else
    echo "❌ Função _showValidationError não encontrada"
fi

if grep -q "_validateQuizCompletion" /workspaces/Titinauta/index.js; then
    echo "✅ Função _validateQuizCompletion encontrada"
else
    echo "❌ Função _validateQuizCompletion não encontrada"
fi

if grep -q "_showIncompleteQuizModal" /workspaces/Titinauta/index.js; then
    echo "✅ Função _showIncompleteQuizModal encontrada"
else
    echo "❌ Função _showIncompleteQuizModal não encontrada"
fi

# Verificar a lógica de validação na navegação
echo "4. Verificando lógica de validação na navegação..."
if grep -q "direction > 0" /workspaces/Titinauta/index.js && grep -q "currentQuiz.answers\[currentDomain.id\]" /workspaces/Titinauta/index.js; then
    echo "✅ Validação de navegação implementada"
else
    echo "❌ Validação de navegação não implementada corretamente"
fi

echo ""
echo "🌐 Para testar manualmente:"
echo "1. Acesse: http://localhost:8000"
echo "2. Preencha os dados iniciais"
echo "3. Navegue até um quiz da semana 5+"
echo "4. Tente avançar sem responder uma pergunta"
echo "5. Verifique se aparece o modal de validação"
echo ""
echo "📝 Cenários de teste:"
echo "- Navegação sem resposta (deve mostrar modal)"
echo "- Conclusão com perguntas pendentes (deve mostrar modal de revisão)"
echo "- Fluxo completo com todas as respostas (deve funcionar normalmente)"
