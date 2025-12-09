#!/bin/bash

# Script de configuración rápida para la API
echo " Configurando API de Gestión de Eventos..."

# Crear estructura de carpetas
echo " Creando estructura de carpetas..."
mkdir -p src/{config,models,controllers,routes,middleware,services,utils}

# Instalar dependencias
echo "Instalando dependencias..."
npm install

# Copiar archivo de entorno de ejemplo
echo "🔧 Configurando variables de entorno..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo " IMPORTANTE: Edita el archivo .env con tus credenciales"
fi

# Dar permisos de ejecución al script
chmod +x setup.sh

echo "Configuración completada!"
echo ""
echo " Siguientes pasos:"
echo "1. Edita el archivo .env con tus credenciales"
echo "2. Configura tu base de datos PostgreSQL"
echo "3. Ejecuta: npm run dev"
echo "4. Visita: http://localhost:3000/health"