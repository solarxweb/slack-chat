.PHONY: install build start

install:
	cd frontend && npm install
	npm install

build:
	npm run build

start:
	npm run start & npm run start-frontend