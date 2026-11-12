<p align="center">
  <img src="screenshot.png" alt="Agar.io Clone Banner" width="700" style="border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);"/>
</p>

<h1 align="center">🦠 Agar.io Clone (Node.js & Canvas)</h1>

<p align="center">
  <strong>Un clon multijugador rápido, ligero y en tiempo real de Agar.io desarrollado con Node.js, Express, Socket.IO y HTML5 Canvas.</strong>
</p>

<p align="center">
  <a href="https://github.com/huytd/agar.io-clone"><img src="https://img.shields.io/badge/Original%20Repo-huytd%2Fagar.io--clone-blue?style=flat-square&logo=github" alt="Original Repo"/></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-green.svg?style=flat-square" alt="License: MIT"/></a>
  <a href="MIT-LEGACY.md"><img src="https://img.shields.io/badge/Attribution-MIT%20Legacy-orange?style=flat-square" alt="MIT Legacy"/></a>
  <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/Node.js-%3E%3D18.0.0-339933?style=flat-square&logo=node.js&logoColor=white" alt="Node.js"/></a>
  <a href="https://render.com"><img src="https://img.shields.io/badge/Deploy%20on-Render-46E3B7?style=flat-square&logo=render&logoColor=black" alt="Render"/></a>
</p>

---

## 📌 Tabla de Contenidos

- [Acerca del Proyecto](#-acerca-del-proyecto)
- [Reconocimiento y Autoría Original](#-reconocimiento-y-autoría-original)
- [Últimas Actualizaciones y Modernización](#-últimas-actualizaciones-y-modernización)
- [Características Principales](#-características-principales)
- [Mecánicas de Juego](#-mecánicas-de-juego)
- [Manual de Instalación y Ejecución Local](#-manual-de-instalación-y-ejecución-local)
- [Despliegue en la Nube (Render PaaS)](#-despliegue-en-la-nube-render-paas)
- [Configuración del Juego](#-configuración-del-juego)
- [Licencia](#-licencia)

---

## 📖 Acerca del Proyecto

Este proyecto es una implementación abierta y completa del popular juego **Agar.io**. Diseñado con fines educativos y comunitarios, permite a los desarrolladores y jugadores desplegar su propio servidor de juego en cuestión de minutos, personalizar las reglas y divertirse con amigos en una red local o en la nube.

---

## 🏆 Reconocimiento y Autoría Original

Este proyecto es un fork continuado y modernizado del código fuente original:

- **Autor Original y Creador**: **Huy Tran** ([@huytd](https://github.com/huytd))
- 🔗 **Repositorio Original en GitHub**: [https://github.com/huytd/agar.io-clone](https://github.com/huytd/agar.io-clone)
- **Mantenedor Posterior**: Owen Ashurst ([@owenashurst](https://github.com/owenashurst/agar.io-clone))

Todos los derechos intelectuales de la arquitectura base, cliente canvas y diseño pertenecen a Huy Tran y a la comunidad de colaboradores. Puedes consultar el aviso legal de atribución en el archivo [MIT-LEGACY.md](MIT-LEGACY.md).

---

## 🚀 Últimas Actualizaciones y Modernización

En esta versión se implementaron mejoras clave en la arquitectura y despliegue del proyecto:

1. **Migración fuera de Docker hacia Alojamiento PaaS Nativo**:
   - Se removió la dependencia de contenedores Docker (`Dockerfile`, `docker-compose.yml`, `.dockerignore`) para simplificar drásticamente el flujo de trabajo y reducir el consumo de recursos.
   - Compatibilidad nativa directa con plataformas PaaS como **Render** y **Railway**.
2. **Infraestructura como Código con `render.yaml`**:
   - Integración de Blueprint para despliegue automatizado en Render con 1 solo clic.
3. **Estandarización de Comandos en `package.json`**:
   - `npm start`: Ahora ejecuta directamente el servidor en producción (`node bin/server/server.js`), ideal para entornos en la nube.
   - `npm run dev`: Mantiene el entorno de desarrollo con recarga en caliente vía `nodemon`.
   - `npm run build`: Pipeline completo de compilación de frontend con Webpack y backend con Babel.
4. **Actualización a Versiones Modernas de Node.js**:
   - Soporte verificado y garantizado para Node.js 18 LTS, 20 LTS y versiones posteriores.
5. **CI/CD Automatizado**:
   - Sustitución de workflows obsoletos de Docker por pruebas continuas automatizadas con GitHub Actions en [.github/workflows/node.js.yml](.github/workflows/node.js.yml).

---

## ✨ Características Principales

- 🌐 **Multijugador en tiempo real**: Sincronización continua de clientes mediante WebSockets (`socket.io`).
- 🎨 **Renderizado fluido en HTML5 Canvas**: Optimizado tanto para escritorio como para pantallas táctiles/móviles.
- 💬 **Chat en vivo integrado**: Soporte de chat entre jugadores con comandos (ej: `-ping`).
- 🦠 **Virus y división de células**: Mecánica completa de virus que fragmentan a células gigantes.
- 🏆 **Tabla de posiciones (Leaderboard)**: Clasificación de los mejores jugadores en tiempo real.
- 🗄️ **Base de datos SQLite**: Registro ligero de logs e intentos de inicio de sesión.

---

## 🎮 Mecánicas de Juego

- **Moverse**: Mueve el cursor del ratón sobre la pantalla para dirigir tu célula.
- **Crecer**: Come partículas de comida esparcidas por el mapa y absorbe a otros jugadores más pequeños.
- **Masa y Velocidad**: A mayor masa acumulada, menor velocidad de movimiento para balancear la partida.
- **Período de Gracia**: Los jugadores recién ingresados cuentan con inmunidad temporal hasta que comienzan a ganar masa.

---

## 🛠️ Manual de Instalación y Ejecución Local

Sigue estos sencillos pasos para correr el juego en tu propia computadora:

### 1. Requisitos Previos

Asegúrate de tener instalado en tu sistema:
- [Node.js](https://nodejs.org/) (Versión **18.x**, **20.x** o superior).
- `npm` (incluido automáticamente con Node.js).
- `git` para clonar el repositorio.

### 2. Clonar el Repositorio

Abre tu terminal y ejecuta:

```bash
git clone https://github.com/owenashurst/agar.io-clone.git
cd agar.io-clone
```

### 3. Instalar Dependencias

Descarga los paquetes necesarios:

```bash
npm install
```

### 4. Ejecutar el Servidor

Tienes dos maneras de correrlo según tu necesidad:

#### A) Modo Desarrollo (Con auto-recarga al editar código)
```bash
npm run dev
```

#### B) Modo Producción (Compilación limpia y ejecución directa)
```bash
npm run build
npm start
```

### 5. Jugar

Una vez que la terminal indique:
```text
[DEBUG] Listening on 0.0.0.0:3000
```
Abre tu navegador e ingresa a:
👉 **[http://localhost:3000](http://localhost:3000)**

Escribe tu nombre de jugador y haz clic en **Play**.

> [!TIP]
> **¿Puerto 3000 ocupado?**  
> Si recibes el error `EADDRINUSE: address already in use`, puedes cambiar el puerto en [config.js](config.js) o definirlo antes de iniciar:
> - En **Windows (PowerShell)**: `$env:PORT=3005; npm start`
> - En **Linux/macOS**: `PORT=3005 npm start`

---

## ☁️ Despliegue en la Nube (Render PaaS)

El proyecto está preparado para desplegarse sin Docker en la capa gratuita de [Render](https://render.com).

### Despliegue con 1 Clic (Blueprint)

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

1. Haz clic en el botón de arriba o conecta tu repositorio en Render como **Blueprint**.
2. Render leerá automáticamente la configuración de [render.yaml](render.yaml).
3. ¡Tu juego estará en línea con HTTPS y WebSockets en minutos!

### Configuración Manual en Render

1. En el panel de Render, selecciona **New > Web Service**.
2. Conecta tu repositorio de GitHub.
3. Especifica los siguientes valores:
   - **Environment / Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: `Free`
4. Haz clic en **Create Web Service**.

---

## ⚙️ Configuración del Juego

Puedes personalizar parámetros como el tamaño del mapa, la masa de inicio, la densidad de comida o virus editando el archivo [config.js](config.js):

```javascript
module.exports = {
    host: "0.0.0.0",
    port: 3000,
    gameWidth: 5000,
    gameHeight: 5000,
    defaultPlayerMass: 10,
    maxFood: 1000,
    maxVirus: 50,
    limitSplit: 16
    // ...
};
```

---

## 📄 Licencia

Este proyecto está distribuido bajo los términos de la Licencia **MIT**.  
Consulta el archivo [LICENSE](LICENSE) para ver el texto legal completo y [MIT-LEGACY.md](MIT-LEGACY.md) para el reconocimiento expreso al autor original **Huy Tran**.
