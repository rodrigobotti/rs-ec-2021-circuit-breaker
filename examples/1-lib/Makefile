# start

start:
	@docker-compose up -d

start/service:
	@docker-compose up -d $(service)

start/address:
	@make start/service service=address-service

start/user:
	@make start/service service=user-service

start/bff:
	@make start/service service=bff

# stop

stop:
	@docker-compose down

stop/service:
	@docker-compose stop $(service)

stop/address:
	@make stop/service service=address-service

stop/user:
	@make stop/service service=user-service

# status

status:
	@docker-compose ps

resources:
	@docker stats 1-lib_bff_1 --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemPerc}}\t{{.NetIO}}\t{{.BlockIO}}"

# logs

logs/service:
	@docker-compose logs -f $(service)

logs/address:
	@make logs/service service=address-service

logs/user:
	@make logs/service service=user-service

logs/bff:
	@make logs/service service=bff

# tests

test:
	@ab -p tests/body.json -T application/json -s 1 -c 2 -n 50 http://localhost:4000/

