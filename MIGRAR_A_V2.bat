@echo off
set "source=%~dp0"
set "dest=%USERPROFILE%\Desktop\SistemaSupraLegis_V2"

echo Creando carpeta en: %dest%
mkdir "%dest%"

echo Copiando archivos...
xcopy "%source%*" "%dest%\" /E /H /C /I /Y

echo.
echo ==========================================
echo  MIGRACION COMPLETADA EXITOSAMENTE
echo ==========================================
echo  Su nueva version esta en la carpeta:
echo  SistemaSupraLegis_V2 en su Escritorio.
echo.
pause
del "%~f0"
