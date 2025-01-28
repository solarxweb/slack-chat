install:
  @make back-ci && make front-ci

back-ci:
  npm install

front-ci:
  cd frontend & npm install

start:
  npm run start
