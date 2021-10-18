# start

start:
	@docker-compose up -d

# stop

stop:
	@docker-compose down

# logs

stats/haproxy:
	open http://localhost:8080/stats

# test

test:
	while true; do curl localhost:3000/api | jq; sleep 2s; done
