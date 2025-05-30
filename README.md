## 📘 Instrucciones para ejecutar la aplicación

### 1️⃣ Clonar el repositorio

Clona el repositorio con el siguiente comando:

```bash
git clone https://github.com/wallshapel/Prueba-Ufinet

```

----------

### 2️⃣ Instalar dependencias del frontend

Accede al directorio del frontend e instala las dependencias:

```bash
cd my-book-app
npm install

```

----------

### 3️⃣ Configurar la base de datos

1.  Asegúrate de configurar correctamente las credenciales en el archivo `application.yml`.
    
2.  Crea manualmente una base de datos llamada **`bookapp`**.
    
    -   Esta debe pertenecer al usuario `sa` o al que hayas especificado en el archivo de configuración.
        
3.  Ejecuta las sentencias SQL que se encuentran en el archivo sql ubicado en la raíz para poblar la base de datos.
    

----------

### 4️⃣ Iniciar el frontend

Una vez que el backend esté corriendo en el puerto **`8080`** (con todas las dependencias del `pom.xml` instaladas), ejecuta el siguiente comando para iniciar el frontend:

```bash
npm run dev

```