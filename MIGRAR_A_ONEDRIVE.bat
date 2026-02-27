@echo off
set "source=%~dp0"
set "dest=C:\Users\migue\OneDrive\Desktop\antigravity"

echo Creando carpeta en OneDrive: %dest%
if not exist "%dest%" mkdir "%dest%"

echo Copiando archivos del sistema...
xcopy "%source%*" "%dest%\" /E /H /C /I /Y

echo.
echo ==================================================
echo  MIGRACION A ONEDRIVE COMPLETADA
echo ==================================================
echo  Su sistema SUPRA LEGIS ahora vive en la nube.
echo  Ubicacion: Escritorio (OneDrive) > antigravity
echo.
pause
del "%~f0"
