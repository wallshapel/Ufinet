#!/bin/sh
set -e
echo "Entering entrypoint.sh..."
echo "VITE_API_BASE_URL: $VITE_API_BASE_URL"
echo "window._env_ = { VITE_API_BASE_URL: '$VITE_API_BASE_URL' };" > /usr/share/nginx/html/env.js
cat /usr/share/nginx/html/env.js
exec nginx -g 'daemon off;'
