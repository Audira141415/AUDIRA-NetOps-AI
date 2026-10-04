@echo off
setlocal enabledelayedexpansion

title AUDIRA NetOps AI - Git Save & Push to GitHub
color 0B

echo.
echo ==============================================================================
echo        🌐 AUDIRA NETOPS AI: ENTERPRISE NOC PLATFORM - 1-CLICK GIT SAVE & PUSH
echo        By AUDIRA (Agus Dwi R) - Proprietary Commercial Software
echo ==============================================================================
echo  Target Repo  : https://github.com/Audira141415/AUDIRA-NetOps-AI.git
echo  Target Branch: main
echo ==============================================================================
echo.

:: 1. Cek apakah Git terinstal
where git >nul 2>nul
if %errorlevel% neq 0 (
    color 0C
    echo [ERROR] Git tidak terdeteksi di sistem PATH Anda!
    echo Silakan install Git for Windows dari https://git-scm.com/
    echo.
    pause
    exit /b 1
)

:: 2. Cek apakah repository git sudah diinisialisasi
if not exist ".git" (
    echo [*] Menginisialisasi Git Repository lokal baru...
    git init -b main
    if %errorlevel% neq 0 (
        git init
        git branch -M main
    )
    echo [OK] Git repository berhasil diinisialisasi.
) else (
    echo [*] Git repository lokal terdeteksi aktif.
)

:: 3. Pastikan branch bernama main
git branch -M main >nul 2>nul

:: 4. Cek dan konfigurasi remote origin
git remote get-url origin >nul 2>nul
if %errorlevel% neq 0 (
    echo [*] Menambahkan remote origin: https://github.com/Audira141415/AUDIRA-NetOps-AI.git
    git remote add origin https://github.com/Audira141415/AUDIRA-NetOps-AI.git
) else (
    echo [*] Menyelaraskan remote origin ke: https://github.com/Audira141415/AUDIRA-NetOps-AI.git
    git remote set-url origin https://github.com/Audira141415/AUDIRA-NetOps-AI.git
)

:: 5. Fetch status remote terbaru
echo [*] Memeriksa status remote GitHub...
git fetch origin main >nul 2>nul

:: 6. Periksa perubahan file lokal
echo [*] Memeriksa status perubahan file...
set HAS_CHANGES=0
for /f "tokens=*" %%i in ('git status --porcelain') do (
    set HAS_CHANGES=1
)

if "!HAS_CHANGES!"=="1" (
    echo.
    echo [*] Terdeteksi perubahan file lokal:
    git status --short
    echo.
    
    :: Staging semua file
    echo [*] Melakukan staging file (git add -A)...
    git add -A

    :: Input pesan commit
    set "DEFAULT_MSG=feat(netops): update AUDIRA NetOps AI v1.0 - Holographic NOC & Enterprise Release (%date% %time%)"
    echo ------------------------------------------------------------------------------
    set /p COMMIT_MSG="[?] Masukkan pesan commit (Tekan Enter untuk default): "
    if "!COMMIT_MSG!"=="" (
        set "COMMIT_MSG=!DEFAULT_MSG!"
    )

    :: Commit perubahan
    echo [*] Melakukan commit: "!COMMIT_MSG!"
    git commit -m "!COMMIT_MSG!"
    if %errorlevel% equ 0 (
        echo [OK] Commit berhasil dibuat.
    )
) else (
    echo [OK] Tidak ada perubahan baru yang perlu di-commit.
)

:: 7. Push ke remote origin main
echo.
echo [*] Mengunggah dan menyinkronkan ke GitHub (origin/main)...
git push -u origin main

if %errorlevel% neq 0 (
    echo.
    echo [!] Terjadi kendala sinkronisasi. Mencoba pull --rebase...
    git pull --rebase origin main >nul 2>nul
    echo [*] Mengulang push ke GitHub...
    git push -u origin main
)

if %errorlevel% equ 0 (
    color 0A
    echo.
    echo ==============================================================================
    echo  [SUCCESS] SELURUH KODE AUDIRA NETOPS AI SUDAH SINKRON DI GITHUB!
    echo  Repositori: https://github.com/Audira141415/AUDIRA-NetOps-AI
    echo  Branch    : main (Up-to-Date)
    echo ==============================================================================
) else (
    color 0E
    echo.
    echo ==============================================================================
    echo  [INFO] Jika GitHub meminta login atau izin akun Audira141415,
    echo  silakan pastikan Personal Access Token (PAT) atau kredensial GitHub Anda aktif.
    echo  Atau jalankan perintah manual: git push -u origin main
    echo ==============================================================================
)

echo.
pause
