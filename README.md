# Description

Solution to the p'unk ave backend challenge as proposed [here](https://github.com/punkave/backend-challenge).

## Deploy

### Tag Docker image

```bash
docker build -t hamax97/punkave-backend-challenge .
```

### Run Docker container

```bash
docker run --env-file .env -p 80:3000 hamax97/punkave-backend-challenge
```

### Push Docker image

```bash
docker push hamax97/punkave-backend-challenge
```

## Develop

### Installation

```bash
$ npm install
```

### Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

### Testing

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```
