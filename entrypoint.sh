#!/bin/sh
set -eu

# Generate default.conf từ default.conf.template
envsubst '${APP_VERSION} ${APP_API_URL} ${APP_KEYCLOAK_AUTHORITY} ${APP_KEYCLOAK_CLIENT_ID} ${APP_KEYCLOAK_REALM}' \
  < /etc/nginx/conf.d/default.conf.template \
  > /etc/nginx/conf.d/default.conf

# Start nginx
exec "$@"