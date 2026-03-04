#!/bin/sh
set -eu

# Generate default.conf từ default.conf.template
 envsubst '${APP_API_URL}' \
  < /etc/nginx/conf.d/default.conf.template \
  > /etc/nginx/conf.d/default.conf

# Start nginx
exec "$@"
