install:
	npm ci && make -C frontend install

build:
	npm run build

start: 
	concurrently "make start-frontend" "make start-backend"

start-backend:
	npm run start

start-frontend:
	npm run dev --prefix frontend

lint:
	make -C frontend lint