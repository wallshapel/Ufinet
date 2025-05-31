# Utiliza una imagen ligera de Nginx
FROM nginx:stable-alpine

# Copia el archivo de configuración personalizado de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia la build de React al directorio que Nginx sirve
COPY dist/ /usr/share/nginx/html

# Expone el puerto por el que se servirá la app
EXPOSE 80

# Comando por defecto
CMD ["nginx", "-g", "daemon off;"]