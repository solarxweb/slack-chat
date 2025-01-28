.PHONY: install back-ci front-ci start

build:
	npm run build

install:
  @make back-ci && make front-ci

back-ci:
  npm install

front-ci:
  cd frontend && npm install && npm run build

start:
  make -j 2 start-backend start-frontend

start-backend:
  npm run start-backend

start-frontend:
  cd frontend && npm run dev