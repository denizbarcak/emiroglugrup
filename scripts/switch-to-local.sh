#!/bin/bash

# Frontend configuration
cp emiroglu-ui/next.config.local.mjs emiroglu-ui/next.config.mjs

# Frontend environment variables
cat > emiroglu-ui/.env.production << EOL
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_ASSETS_URL=http://localhost:8080
EOL

# Backend environment variables
cat > emiroglu-api/.env << EOL
PORT=8080
MONGODB_URI=mongodb://localhost:27018/emiroglu
JWT_SECRET=emiroglugrupsecretkey2024
ENV=local
UPLOAD_PATH=/Users/denizbarcak/Desktop/emiroglugrup/assets
EOL

echo "Switched to local mode"