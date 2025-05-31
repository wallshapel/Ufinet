## 📘 Instrucciones para ejecutar la aplicación

### 1️⃣ Clonar el repositorio

Clona el repositorio con el siguiente comando:

```
git clone https://github.com/wallshapel/Prueba-Ufinet
```

----------

### 2️⃣ Instalar dependencias del frontend

Accede al directorio del frontend e instala las dependencias:

```
cd my-book-app
npm install
```

----------

### 3️⃣ Configurar la base de datos

1.  Asegúrate de configurar correctamente las credenciales en el archivo `application.yml`.
    
2.  Crea manualmente una base de datos llamada `**bookapp**`.
    
    -   Esta debe pertenecer al usuario `sa` o al que hayas especificado en el archivo de configuración.
        
3.  Ejecuta las sentencias SQL que se encuentran en el archivo correspondiente para poblar la base de datos.
    

----------

### 4️⃣ Iniciar el frontend

Una vez que el backend esté corriendo en el puerto `**8080**` (con todas las dependencias del `pom.xml` instaladas), ejecuta el siguiente comando para iniciar el frontend:

```
npm run dev
```

----------

### ⚠️ Advertencia sobre usabilidad

Dado que esta aplicación utiliza JWT y no maneja sesiones con estado, el token generado tras el inicio de sesión se almacena en `localStorage` y tiene una duración de **3 minutos**. Una vez pasa este tiempo si el usuario actualiza o intenta hacer algo, es redirigdo automáticamente al login

Esto significa que:

-   Si un usuario inicia sesión, su token se mantiene activo durante ese tiempo.
    
-   Si otro usuario intenta usar la app desde el mismo navegador antes de que ese token expire, verá la información del usuario anterior/nada/error.
    

✅ **Solución temporal**: limpiar el `localStorage` manualmente:

1.  Presiona `F12` para abrir las herramientas del desarrollador.
    
2.  Ve a la pestaña `Application`.
    
3.  En la sección `Storage`, haz clic en `Local Storage` y selecciona `http://localhost:5173`.
    
4.  Haz clic derecho sobre el valor almacenado y selecciona `Delete`.
    

----------

### 🔹 Uso de la colección de Postman

En la raíz del proyecto se incluye una colección de **Postman** que facilita el uso de la API.

Una vez consumido el endpoint de login, el token JWT generado se asigna automáticamente a los demás endpoints de la colección, permitiendo hacer pruebas de manera fluida sin necesidad de copiarlo manualmente.