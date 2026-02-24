#!/bin/bash

# Load NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Use Node v23.1.0
nvm use v23.1.0

# Clean build cache
rm -rf .next

# Start development server
npm run dev

