## 🚀 Guía de ejecución de la aplicación

### 1️⃣ Clonar el repositorio

```bash
git clone https://github.com/wallshapel/Prueba-Ufinet
```

---

### 🐳 Entorno Dockerizado (Recomendado)

Puedes ejecutar todo el sistema con un solo comando gracias a Docker Compose. Esta es la **única forma soportada** actualmente para levantar la aplicación.

```bash
docker compose up -d
```

🔎 **Consideraciones importantes**:

* **Base de datos (SQL Server)** se expone por el puerto `1434`. Si usas herramientas como DBeaver, conéctate usando ese puerto (no el 1433).
* **Backend** se ejecuta en el puerto `8080`.
* **Frontend** corre en el puerto `5173`.

Asegúrate de que esos puertos estén **libres** antes de ejecutar el comando.

📁 Para que la base de datos tenga persistencia, crea el siguiente directorio con los permisos adecuados:

```bash
sudo mkdir -p /home/legato/sql-server-dockerized
sudo chown -R 10001:0 /home/legato/sql-server-dockerized
sudo chmod -R 770 /home/legato/sql-server-dockerized
```

💡 **Nota para usuarios de Windows**: esta ruta (`/home/legato/...`) aplica a sistemas Linux. Si usas Docker en Windows, deberás ajustar la ruta según tu sistema (no se provee soporte específico para Windows).

🔗 Luego de ejecutar `docker compose up -d`, puedes verificar que todo esté corriendo correctamente con:

```bash
docker ps -a
```

Abre tu navegador y accede a:

[http://localhost:5173](http://localhost:5173)

---

### ⚠️ Advertencia sobre usabilidad

Esta app utiliza JWT y no maneja sesiones con estado. El token de autenticación se guarda en `localStorage` y **dura 3 minutos**.

* Si otro usuario intenta usar la app en el mismo navegador antes de que expire ese token, puede ver datos incorrectos o errores.

✅ **Recomendación**: siempre que termines una sesión, se recomienda **cerrar sesión antes de cerrar el navegador** para evitar conflictos con tokens activos.

---

### 📬 Colección de Postman incluida

La raíz del proyecto contiene una colección de **Postman** para facilitar pruebas.

* Al autenticarte con el endpoint de login, el token JWT se aplica automáticamente al resto de endpoints.
* No es necesario copiarlo manualmente, lo que agiliza el proceso de pruebas.

---

✅ ¡Listo! La aplicación está completamente lista para ejecutarse utilizando Docker Compose.
