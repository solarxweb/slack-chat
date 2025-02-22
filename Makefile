install:
	npm ci && cd frontend & npm ci

build: 
	npm run build

start-backend:
	npm run start

start-frontend:
	cd frontend && npm start

develop:
	make start-backend && make start-frontend

lint:
	make -C frontend lint
