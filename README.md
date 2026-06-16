# DiscoStore API

**DiscoStore** es una API REST académica desarrollada con **Node.js** y **Express** para la gestión del catálogo de álbumes de una tienda de música. La persistencia se realiza localmente utilizando la base de datos **SQLite** con el driver `better-sqlite3`. La validación de los datos entrantes se gestiona mediante esquemas con **Zod**.

---

## Stack Tecnológico
- **Node.js**: Entorno de ejecución para JavaScript en el servidor.
- **Express**: Framework web minimalista para la creación de la API.
- **SQLite** (vía `better-sqlite3`): Base de datos relacional integrada en el proyecto.
- **Zod**: Librería de validación de esquemas y tipado estático en tiempo de ejecución.
- **dotenv**: Manejo seguro de variables de entorno.
- **nodemon** (Desarrollo): Reinicio automático del servidor al detectar cambios.

---

## Instalación y Configuración

### 1. Requisitos Previos
* **Node.js** (versión recomendada 18 o superior). Puedes verificar tu versión actual con:
  ```bash
  node -v
  ```

### 2. Instalar dependencias
Desde la raíz del proyecto, ejecuta el siguiente comando para instalar todos los módulos necesarios:
```bash
npm install
```

### 3. Configurar variables de entorno
Crea o edita el archivo `.env` en la raíz del proyecto para definir el puerto y host del servidor:
```ini
PORT=3000
HOST=localhost
```

---

## Inicialización y Siembra de la Base de Datos

La API inicializa y puebla la base de datos de manera automatizada al arrancar por primera vez:

1. **Creación**: El módulo `db.js` abre (o crea) el archivo local de base de datos `discostore.db`.
2. **Tablas**: Ejecuta la sentencia SQL para crear la tabla `albumes` si esta no existe en el archivo.
3. **Siembra (Seed)**: El sistema verifica si la tabla `albumes` está vacía (`SELECT COUNT(*) FROM albumes`). 
   - Si la tabla está vacía, el sistema lee de forma síncrona el archivo `datos.json`, procesa los 6 álbumes preconfigurados y los inserta en la base de datos mediante una transacción atómica de SQLite para garantizar la integridad de los datos.
   - Si la tabla ya cuenta con registros, la siembra se omite automáticamente para no alterar los cambios.
4. A partir de la siembra inicial, todas las consultas y escrituras se ejecutan en tiempo real sobre el archivo SQLite y no vuelven a depender de `datos.json`.

---

## Endpoints de la API

La API cuenta con los siguientes endpoints expuestos:

### Información General
* **`GET /`**
  - **Descripción**: Obtiene la información general de la API.
  - **Código de Respuesta**: `200 OK`
  - **Respuesta**:
    ```json
    {
      "nombre": "DiscoStore API",
      "version": "1.0.0",
      "descripcion": "API REST para administrar el catalogo de albumes de una tienda de musica."
    }
    ```

### Gestión de Álbumes
* **`GET /albumes`**
  - **Descripción**: Obtiene la lista de todos los álbumes almacenados en la base de datos.
  - **Código de Respuesta**: `200 OK`

* **`GET /album/:slug`**
  - **Descripción**: Obtiene el detalle de un álbum específico por su slug identificador.
  - **Código de Respuesta**: 
    - `200 OK` si se encuentra el recurso.
    - `404 Not Found` si el álbum no existe.

* **`GET /genero/:genero`**
  - **Descripción**: Devuelve un arreglo con los slugs de los álbumes que pertenecen al género musical especificado (búsqueda sin distinción de mayúsculas/minúsculas).
  - **Código de Respuesta**: `200 OK`
  - **Respuesta**: `["thriller", "random-access-memories"]`

* **`GET /search/:text`**
  - **Descripción**: Realiza una búsqueda parcial y difusa de álbumes que contengan el término indicado en los campos `titulo`, `artista` o `descripcion`.
  - **Código de Respuesta**: `200 OK`

* **`POST /albumes`**
  - **Descripción**: Crea un nuevo álbum en el catálogo. Genera automáticamente el `slug` a partir del título del álbum.
  - **Cabeceras de Respuesta obligatorias**: `Location` apuntando a `/album/:slug` del nuevo recurso.
  - **Códigos de Respuesta**:
    - `201 Created` si la creación es exitosa.
    - `400 Bad Request` si la validación del esquema con Zod falla.
    - `409 Conflict` si el slug generado ya existe en la base de datos.
  - **Cuerpo de la Petición (JSON)**:
    ```json
    {
      "titulo": "Discovery",
      "artista": "Daft Punk",
      "genero": "Electronica",
      "anio": 2001,
      "sello": "Virgin",
      "pistas": 14,
      "imagen": "discovery.avif",
      "resumen": "El segundo album de Daft Punk que marco una era.",
      "descripcion": "Incluye exitos mundiales como One More Time y Harder, Better, Faster, Stronger."
    }
    ```

* **`PUT /album/:slug`**
  - **Descripción**: Actualiza todos los campos de un álbum existente identificado por su slug original. Si el título se modifica, genera y actualiza el slug de forma correspondiente.
  - **Códigos de Respuesta**:
    - `200 OK` si la actualización fue exitosa.
    - `400 Bad Request` si la validación del esquema Zod falla.
    - `404 Not Found` si el álbum original no existe.
    - `409 Conflict` si el nuevo título genera un slug que ya está en uso por otro álbum.

* **`DELETE /album/:slug`**
  - **Descripción**: Elimina un álbum del catálogo por su slug.
  - **Códigos de Respuesta**:
    - `204 No Content` si la eliminación fue exitosa (respuesta sin cuerpo).
    - `404 Not Found` si el álbum no existe.

### Archivos Estáticos
* **`GET /imagenes/:filename`**
  - **Descripción**: Permite acceder y servir de forma estática las portadas del catálogo de álbumes almacenadas en el directorio local `/imagenes`.
  - **Códigos de Respuesta**: `200 OK` / `404 Not Found`

---

## Ejecución del Servidor

### Modo Producción / Servidor Estándar
Inicia la API utilizando el motor de Node directamente:
```bash
npm start
```

### Modo Desarrollo (Auto-reload)
Arranca el servidor usando `nodemon` para que se reinicie automáticamente con cualquier modificación de código:
```bash
npm run dev
```
