@echo off
echo Iniciando teste de autenticacao do EducareApp...

echo.
echo === Verificando dependencias do backend ===
cd educare-backend
if not exist node_modules (
    echo Instalando dependencias do backend...
    call npm install
)

echo.
echo === Verificando dependencias do frontend ===
cd ..
if not exist node_modules (
    echo Instalando dependencias do frontend...
    call npm install --legacy-peer-deps
)

echo.
echo === Iniciando o backend (porta 3000) ===
start cmd /k "cd educare-backend && npm run dev"

echo.
echo === Aguardando o backend iniciar (5 segundos) ===
timeout /t 5 /nobreak > nul

echo.
echo === Iniciando o frontend (porta 5173) ===
start cmd /k "npm run dev"

echo.
echo === Ambiente de teste iniciado! ===
echo Backend: http://localhost:3000
echo Frontend: http://localhost:5173
echo.
echo Teste de autenticacao:
echo 1. Acesse http://localhost:5173 no navegador
echo 2. Clique em "Entrar" ou "Login"
echo 3. Use suas credenciais para fazer login
echo 4. Verifique se o login foi bem-sucedido e se voce foi redirecionado para o dashboard
echo.
