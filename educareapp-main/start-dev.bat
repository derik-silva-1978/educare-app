@echo off
echo Iniciando ambiente de desenvolvimento EducareApp...

echo.
echo === Verificando dependências do backend ===
cd educare-backend
if not exist node_modules (
    echo Instalando dependências do backend...
    call npm install
)

echo.
echo === Verificando dependências do frontend ===
cd ..
if not exist node_modules (
    echo Instalando dependências do frontend...
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
echo === Ambiente de desenvolvimento iniciado! ===
echo Backend: http://localhost:3000
echo Frontend: http://localhost:5173
echo.
