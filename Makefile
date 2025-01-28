.PHONY: install back-ci front-ci start

install:
    @make back-ci && make front-ci

back-ci:
    npm install

front-ci:
    cd frontend && npm install

start:
    make -j 2 start-backend start-frontend

start-backend:
    npm run start-backend

start-frontend:
    cd frontend && npm run dev