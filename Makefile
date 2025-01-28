.PHONY: install front-install start

front-install:
	cd frontend && npm install

install:
	npm install
	make front-install

start:
	npm run start-backend & cd frontend && npm run dev