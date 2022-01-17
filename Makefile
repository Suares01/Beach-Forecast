include .env

.RECIPEPREFIX = >

.PHONY: up

up:
> docker-compose up -d

.PHONY: start

start:
> docker-compose start

.PHONY: stop

stop:
> docker-compose stop

.PHONY: down

down:
> docker-compose down
