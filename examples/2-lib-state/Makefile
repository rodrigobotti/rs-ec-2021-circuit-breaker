# start

start:
	@docker-compose up -d

start/server:
	@docker-compose up -d backend-server

# stop

stop:
	@docker-compose down

stop/server:
	@docker-compose stop backend-server

# logs

logs/1:
	@docker-compose logs -f backend-client-node-1

logs/2:
	@docker-compose logs -f backend-client-node-2

logs/3:
	@docker-compose logs -f backend-client-node-3

# redis

# keys *
# keys CIRCUIT_BREAKER.*
# get CIRCUIT_BREAKER.server_integration
# ttl CIRCUIT_BREAKER.server_integration

redis-cli:
	@npx rdcli -h localhost -p 6379
