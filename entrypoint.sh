#!/bin/sh

# Replace environment variables in env-config.js
envsubst '
  $VITE_N8N_WEBHOOK_ID
  $VITE_N8N_BASE_URL
  $VITE_CORS_WHITELIST
' < /usr/share/nginx/html/env-config.js.template > /usr/share/nginx/html/env-config.js

# Replace CORS whitelist in nginx configuration
if [ -n "$VITE_CORS_WHITELIST" ]; then
  sed -i "s/__CORS_WHITELIST__/$VITE_CORS_WHITELIST/g" /etc/nginx/conf.d/default.conf
else
  sed -i "s/__CORS_WHITELIST__/*/g" /etc/nginx/conf.d/default.conf
fi

# Start nginx
exec nginx -g "daemon off;"