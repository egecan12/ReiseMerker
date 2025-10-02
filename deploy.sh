#!/bin/bash

# Location Notebook - Docker Deployment Script
# Usage: ./deploy.sh [environment]

set -e

ENVIRONMENT=${1:-production}
COMPOSE_FILE="docker-compose.yml"

echo "🚀 Starting Location Notebook deployment..."
echo "Environment: $ENVIRONMENT"

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    echo "📝 Please copy env.example to .env and configure your environment variables:"
    echo "   cp env.example .env"
    echo "   nano .env"
    exit 1
fi

# Load environment variables
source .env

echo "📋 Environment variables loaded"

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose -f $COMPOSE_FILE down

# Remove old images (optional)
if [ "$2" = "--clean" ]; then
    echo "🧹 Cleaning up old images..."
    docker-compose -f $COMPOSE_FILE down --rmi all
fi

# Build and start services
echo "🔨 Building and starting services..."
docker-compose -f $COMPOSE_FILE up --build -d

# Wait for services to be healthy
echo "⏳ Waiting for services to be healthy..."
sleep 30

# Check service health
echo "🏥 Checking service health..."

# Check MongoDB
if docker-compose -f $COMPOSE_FILE exec -T mongodb mongosh --eval "db.runCommand('ping')" > /dev/null 2>&1; then
    echo "✅ MongoDB is healthy"
else
    echo "❌ MongoDB health check failed"
    exit 1
fi

# Check Backend
if curl -f http://localhost:${BACKEND_PORT:-3000}/api/health > /dev/null 2>&1; then
    echo "✅ Backend is healthy"
else
    echo "❌ Backend health check failed"
    exit 1
fi

# Check Frontend
if curl -f http://localhost:${FRONTEND_PORT:-80}/health > /dev/null 2>&1; then
    echo "✅ Frontend is healthy"
else
    echo "❌ Frontend health check failed"
    exit 1
fi

echo ""
echo "🎉 Deployment completed successfully!"
echo ""
echo "📱 Frontend: http://localhost:${FRONTEND_PORT:-80}"
echo "🔧 Backend API: http://localhost:${BACKEND_PORT:-3000}"
echo "🗄️  MongoDB: mongodb://localhost:${MONGO_PORT:-27017}"
echo ""
echo "📊 View logs: docker-compose -f $COMPOSE_FILE logs -f"
echo "🛑 Stop services: docker-compose -f $COMPOSE_FILE down"
echo ""
