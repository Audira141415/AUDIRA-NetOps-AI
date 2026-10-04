@echo off
setlocal
chcp 65001 >nul

title AUDIRA NetOps AI - Git Save and Push to GitHub
color 0B

echo.
echo ================================================================
echo   AUDIRA NETOPS AI: ENTERPRISE NOC PLATFORM - 1-CLICK GIT SAVE
echo   By AUDIRA (Agus Dwi R) - Proprietary Commercial Software
echo ================================================================
echo   Target Repo  : https://github.com/Audira141415/AUDIRA-NetOps-AI.git
echo   Target Branch: main
echo ================================================================
echo.

:: 1. Cek apakah Git terinstal
where git >nul 2>nul
if errorlevel 1 (
    color 0C
    echo [ERROR] Git tidak terdeteksi di sistem PATH Anda!
    echo Silakan install Git for Windows dari https://git-scm.com/
    echo.
    pause
    exit /b 1
)

:: 2. Cek apakah repository git sudah diinisialisasi
if not exist ".git" (
    echo [*] Menginisialisasi Git Repository lokal baru
    git init
    git branch -M main
    echo [OK] Git repository berhasil diinisialisasi
) else (
    echo [*] Git repository lokal terdeteksi aktif
)

:: 3. Pastikan branch bernama main
git branch -M main >nul 2>nul

:: 4. Cek dan konfigurasi remote origin
git remote get-url origin >nul 2>nul
if errorlevel 1 (
    echo [*] Menambahkan remote origin: https://github.com/Audira141415/AUDIRA-NetOps-AI.git
    git remote add origin https://github.com/Audira141415/AUDIRA-NetOps-AI.git
) else (
    echo [*] Menyelaraskan remote origin ke: https://github.com/Audira141415/AUDIRA-NetOps-AI.git
    git remote set-url origin https://github.com/Audira141415/AUDIRA-NetOps-AI.git
)

:: 5. Melakukan staging semua file
echo.
echo [*] Melakukan staging seluruh perubahan file (git add -A)
git add -A

:: 6. Tampilkan ringkasan status
git status --short
echo.

set "COMMIT_MSG=feat(netops): update AUDIRA NetOps AI v1.0 by AUDIRA (Agus Dwi R)"
set /p USER_MSG="[?] Masukkan pesan commit (Tekan Enter untuk default): "
if defined USER_MSG (
    if not "%USER_MSG%"=="" (
        set "COMMIT_MSG=%USER_MSG%"
    )
)

echo.
echo [*] Melakukan commit perubahan
git commit -m "%COMMIT_MSG%"
echo [OK] Langkah commit selesai

:: 7. Push ke remote origin main
echo.
echo [*] Mengunggah dan menyinkronkan ke GitHub (origin/main)
git push -u origin main

if errorlevel 1 (
    echo.
    echo [!] Terjadi kendala sinkronisasi. Mencoba pull rebase
    git pull --rebase origin main
    echo [*] Mengulang push ke GitHub
    git push -u origin main
)

if errorlevel 1 goto :push_failed
goto :push_success

:push_failed
color 0E
echo.
echo ================================================================
echo   [INFO] Jika GitHub meminta otentikasi akun Audira141415,
echo   pastikan Personal Access Token ^(PAT^) aktif.
echo   Atau jalankan perintah manual: git push -u origin main
echo ================================================================
goto :script_end

:push_success
color 0A
echo.
echo ================================================================
echo   [SUCCESS] SELURUH KODE AUDIRA NETOPS AI SINKRON DI GITHUB!
echo   Repositori: https://github.com/Audira141415/AUDIRA-NetOps-AI
echo   Branch    : main (Up-to-Date)
echo ================================================================

:script_end

echo.
pause
