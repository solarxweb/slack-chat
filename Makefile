install:
	npm ci

start-frontend:
	make -C frontend start

start-backend:
	npm start

start:
	make start-backend

local-start:
	make start-backend & make start-frontend

build:
	rm frontend/build -rf
	npm run build