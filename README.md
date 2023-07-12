## Plop JS Demo

This repository showcases how plop can be used to generate common directory and file structure.

## Running the development server

**Create .env file**

`cp .env.example .env`

_Note: Feel free to change the content as needed_

**Create docker-compose.yml**

`cp docker-compose.yml.example docker-compose.yml`

**Starting up containers**

`docker compose up -d` or `docker-compose up -d`

**Install dependencies**

`yarn`

**Running Prisma migration**

`yarn prisma db push`

**Running development server for Consumer API**

`yarn consumer:dev`

**Generating Servers and Modules with plop**

`yarn plop`
