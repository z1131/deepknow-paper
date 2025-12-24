#!/bin/sh

# 从环境变量生成 config.js
cat > /usr/share/nginx/html/config.js << EOF
window.__CONFIG__ = {
  API_BASE: "${API_BASE:-http://localhost:8888}",
  WS_BASE: "${WS_BASE:-ws://localhost:8888}"
};
EOF

# 启动 nginx
exec "$@"
