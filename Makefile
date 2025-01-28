install: back-ci front-ci
  make start

back-ci:
  npm install

front-ci:
  cd frontend & npm install

start:
  npm run start
