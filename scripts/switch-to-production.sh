#!/bin/bash

# Frontend configuration
cp emiroglu-ui/next.config.production.mjs emiroglu-ui/next.config.mjs

# Frontend environment variables
cat > emiroglu-ui/.env.production << EOL
NEXT_PUBLIC_API_URL=http://135.181.249.171:8080
NEXT_PUBLIC_ASSETS_URL=http://135.181.249.171:8080
EOL

# Backend environment variables
cat > emiroglu-api/.env << EOL
PORT=8080
MONGODB_URI=mongodb://127.0.0.1:27018/emiroglu
JWT_SECRET=emiroglugrupsecretkey2024
ENV=production
UPLOAD_PATH=/var/www/emiroglugrup/assets
EOL

echo "Switched to production mode"