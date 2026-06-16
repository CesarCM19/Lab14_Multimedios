# Referencias Consultadas

Este documento detalla las fuentes y documentación técnica consultadas para el diseño y desarrollo del proyecto académico **DiscoStore**.

---

## 1. Node.js & Express Framework
- **Express - Guía de Direccionamiento (Routing)**
  - *Descripción*: Guía oficial sobre la definición de rutas, parámetros de ruta (`req.params`) e integración del enrutador (`express.Router`).
  - *URL*: [https://expressjs.com/es/guide/routing.html](https://expressjs.com/es/guide/routing.html)
- **Express - Servir archivos estáticos**
  - *Descripción*: Documentación sobre el uso del middleware integrado `express.static` para servir recursos estáticos como portadas de discos.
  - *URL*: [https://expressjs.com/es/starter/static-files.html](https://expressjs.com/es/starter/static-files.html)
- **Node.js - Módulo de File System (fs)**
  - *Descripción*: Documentación del API del núcleo de Node.js para lectura de archivos síncronos (`readFileSync`) y verificación de existencia en disco (`existsSync`).
  - *URL*: [https://nodejs.org/api/fs.html](https://nodejs.org/api/fs.html)

---

## 2. Base de Datos (SQLite)
- **better-sqlite3 - Documentación Oficial**
  - *Descripción*: Guía completa y repositorio de la librería `better-sqlite3`. Cubre la API síncrona para sentencias preparadas (`prepare`), ejecuciones de transacciones (`transaction`) e inserciones/búsquedas de datos (`run`, `get`, `all`).
  - *URL*: [https://github.com/WiseLibs/better-sqlite3/blob/master/docs/api.md](https://github.com/WiseLibs/better-sqlite3/blob/master/docs/api.md)
- **SQLite - Lenguaje SQL y Constraints**
  - *Descripción*: Manual de referencia de SQLite sobre la sintaxis de creación de tablas (`CREATE TABLE IF NOT EXISTS`), claves primarias (`PRIMARY KEY`) y búsquedas de texto parcial (`LIKE`).
  - *URL*: [https://www.sqlite.org/lang.html](https://www.sqlite.org/lang.html)

---

## 3. Validación de Datos
- **Zod - Documentación del Desarrollador**
  - *Descripción*: Guía oficial de Zod sobre la construcción de esquemas de validación de objetos (`z.object`), tipos de datos primitivos (`z.string`, `z.number`), validaciones de cadenas vacías (`.min(1)`) y captura de errores sin lanzar excepciones utilizando parseo seguro (`safeParse`).
  - *URL*: [https://zod.dev/](https://zod.dev/)

---

## 4. Gestión de Configuración
- **dotenv - Módulo de Variables de Entorno**
  - *Descripción*: Documentación oficial sobre la lectura de archivos `.env` y su inyección automática en el proceso de Node.js (`process.env`).
  - *URL*: [https://www.npmjs.com/package/dotenv](https://www.npmjs.com/package/dotenv)
