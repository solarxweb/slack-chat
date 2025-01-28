back-ci:
	npm install

install:
	make back-ci && cd frontend & npm install

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