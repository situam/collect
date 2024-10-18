#!/bin/bash

# Function to start a service in a specified directory
start_service() {
  local dir="$1"
  local cmd="$2"
  echo "Starting service in $dir..."
  (
    cd "$dir" || { echo "Failed to change directory to $dir"; exit 1; }
    eval "$cmd" &
    echo "Started service with command: $cmd"
  )
}

start_pocketbase() {
  start_service "database" "./pocketbase serve"
}

start_frontend() {
  start_service "frontend" "npm run dev"
}

start_backend() {
  start_service "backend" "node main.js"
}

start_liveagora_server() {
  start_service "../liveagora-server" "node app.js"
}

start_liveagora() {
  start_service "../liveagora" "npm run dev"
}

# Start all services
start_pocketbase
start_backend
start_frontend
start_liveagora_server
start_liveagora

wait

