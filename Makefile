build:
	docker build -t web .

run:
	docker-compose up

stop:
	docker-compose down