## 🚀 Guía de ejecución de la aplicación

### 1️⃣ Clonar el repositorio

```bash
git clone https://github.com/wallshapel/Prueba-Ufinet

```

----------

### 🐳 Entorno Dockerizado (Recomendado)

Puedes ejecutar todo el sistema con un solo comando gracias a Docker Compose. Esta es la **única forma soportada** actualmente para levantar la aplicación.

Antes de ejecutarlo, asegúrate de que los siguientes **puertos estén libres**:

-   `1433` para el contenedor de la base de datos
    
-   `8080` para el backend
    
-   `5173` para el frontend
    

Luego, simplemente ejecuta:

```bash
docker compose up -d

```

----------

### 🛠️ Conexión a la base de datos

Una vez levantados los contenedores (el contenedor prueba-ufinet-backend
 fallará, pero es normal), abre tu herramienta favorita (por ejemplo, **DBeaver**) y conéctate al motor de SQL Server con los siguientes parámetros:

-   **Host:** `localhost`
    
-   **Puerto:** `1433`
    
-   **Authentication:** `SQL Server Authentication`
    
-   **Usuario:** `sa`
    
-   **Contraseña:** `Prueba-Ufinet-123*`
    

🔧 En las propiedades del driver, asegúrate de establecer:

-   `trustServerCertificate: true`
    
-   `encrypt: true`
    

Una vez conectado, crea una base de datos con el siguiente nombre:

```
bookapp

```

> ℹ️ **Importante:** no es necesario crear la estructura de la base de datos manualmente. El contenedor del backend se encarga de ello automáticamente al iniciar, siempre que la base de datos `bookapp` ya exista.

En el repositorio se incluye un archivo `.sql` que contiene:

-   Las sentencias para construir la estructura de las tablas (si se desea hacerlo manualmente).
    
-   Datos de ejemplo, incluyendo un usuario con algunos libros cargados.
    
    -   **Contraseña del usuario en texto plano:** `abel123` (ya está encriptada en el archivo).
        

Una vez creada la base de datos, ejecuta:

```bash
docker start prueba-ufinet-backend

```

Abre tu navegador y accede a:

[http://localhost:5173](http://localhost:5173/)

----------

### ⚠️ Advertencia sobre usabilidad

Esta app utiliza JWT y no maneja sesiones con estado. El token de autenticación se guarda en `localStorage` y **dura 3 minutos**.

-   Si otro usuario intenta usar la app en el mismo navegador antes de que expire ese token, puede ver datos incorrectos o errores.
    

✅ **Recomendación**: siempre que termines una sesión, se recomienda **cerrar sesión antes de cerrar el navegador** para evitar conflictos con tokens activos.

----------

### 📬 Colección de Postman incluida

La raíz del proyecto contiene una colección de **Postman** para facilitar pruebas.

-   Al autenticarte con el endpoint de login, el token JWT se aplica automáticamente al resto de endpoints.
    
-   No es necesario copiarlo manualmente, lo que agiliza el proceso de pruebas.
    

----------

✅ ¡Listo! La aplicación está completamente lista para ejecutarse utilizando Docker Compose y conectarse mediante DBeaver para inicializar la base de datos.