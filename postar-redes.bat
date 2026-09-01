@echo off
chcp 65001 > nul
title Assistente de Publicacao PrecoSmart

echo ========================================================
echo       🚀 PUBLICADOR DE REDES SOCIAIS - PREÇOSMART
echo ========================================================
echo.
echo Escolha onde deseja postar agora:
echo.
echo [1] Postar no LINKEDIN (Copia o texto + abre a foto e o LinkedIn)
echo [2] Postar no INSTAGRAM (Copia o texto + abre a foto e o Instagram)
echo [3] Abrir ambos
echo [4] Sair
echo.
set /p opcao="Digite o numero da opcao (1, 2, 3 ou 4): "

if "%opcao%"=="1" goto linkedin
if "%opcao%"=="2" goto instagram
if "%opcao%"=="3" goto ambos
if "%opcao%"=="4" goto fim

:linkedin
echo.
echo [1/3] Copiando texto oficial para a area de transferencia...
powershell -NoProfile -Command "Get-Content -Raw -Encoding UTF8 'LINKEDIN_POST.md' | Set-Clipboard"
echo ✓ Texto copiado com sucesso!
echo.
echo [2/3] Abrindo pasta com a imagem do banner em 8K...
explorer.exe /select,"%~dp0assets\linkedin-showcase-v3.jpg"
echo.
echo [3/3] Abrindo o LinkedIn no seu navegador...
start https://www.linkedin.com/feed/
echo.
echo ========================================================
echo 👉 NO LINKEDIN:
echo 1. Clique em 'Iniciar publicacao'.
echo 2. Pressione CTRL + V para colar o texto.
echo 3. Arraste a imagem selecionada 'linkedin-showcase-v3.jpg'.
echo 4. Clique em 'Publicar'!
echo ========================================================
pause
goto fim

:instagram
echo.
echo [1/3] Copiando legenda oficial para a area de transferencia...
powershell -NoProfile -Command "Get-Content -Raw -Encoding UTF8 'INSTAGRAM_POST.md' | Set-Clipboard"
echo ✓ Legenda copiada com sucesso!
echo.
echo [2/3] Abrindo pasta com a imagem do post...
explorer.exe /select,"%~dp0assets\instagram-post.jpg"
echo.
echo [3/3] Abrindo o Instagram no seu navegador...
start https://www.instagram.com/
echo.
echo ========================================================
echo 👉 NO INSTAGRAM:
echo 1. Clique no botao '+' (Criar).
echo 2. Arraste a imagem selecionada 'instagram-post.jpg'.
echo 3. Cole a legenda com CTRL + V.
echo 4. Clique em 'Compartilhar'!
echo ========================================================
pause
goto fim

:ambos
call :linkedin
call :instagram
goto fim

:fim
exit
