install:
	cd frontend && npm ci

dev:
	cd frontend && npm run dev

start-backend:
	npm start

start-frontend:
	cd frontend && npm run dev

start:
	concurrently "npm start" "cd frontend && npm run dev"

build:
	cd frontend && npm run build

.PHONY: install dev start build start-backend start-frontend