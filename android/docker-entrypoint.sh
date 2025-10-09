#!/bin/sh

# Replace environment variables in built files
BACKEND_URL=${BACKEND_URL:-http://localhost:3000}
find /usr/share/nginx/html -name "*.js" -exec sed -i "s|http://localhost:3000|${BACKEND_URL}|g" {} \;

# Start nginx
nginx -g "daemon off;"
