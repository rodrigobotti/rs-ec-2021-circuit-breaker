![](https://storage.googleapis.com/golden-wind/experts-club/capa-github.svg)

# Exemplo 2: Circuit Breaker - biblioteca local com estado distribuído

![](/.github/assets/example-2.png)

Neste exemplo teremos um sistema com a seguinte arquitetura:

- Backend Service:
    - API REST
    - implementado em Node.JS
    - retorna um nome fictício de um possível usuário

- Client Service:
    - API REST
    - implementado em Node.JS
    - chama o backend service e retorna o valor recebido
    - chamda http ao backend service protegida por implementação de `circuit breaker` local que utiliza o `Redis` para armazenar seu estado
    - deployado em três replicas

- Redis
    - [Redis](https://redis.io/) como cache distribuído
    - guarda o estado dos _circuit breakers_ como chave-valor

## Execução local

O sistema é _deployado_ localmente utilizando _docker_ e _docker-compose_.

### Comandos

O exemplo utiliza `make` como task manager. 
Os targets estão definidos no [Makefile](./Makefile).

```sh
# builda todas as imagens e sobe os serviços dentro de uma mesma rede
make start

# reinicia o backend service
make start/server

# derruba o backend server
make stop/server

# tail do log de cada replica do client service
make logs/1
make logs/2
make logs/3

# conecta-se ao redis
# precisa de Node.JS instalado
make redis-cli

# derruba toda a infraestrutura
make stop
```

## Referências
- https://martinfowler.com/bliki/CircuitBreaker.html
- https://docs.microsoft.com/en-us/azure/architecture/patterns/circuit-breaker
- https://redis.io/
- https://github.com/luin/ioredis


## Expert

| [<img src="https://avatars.githubusercontent.com/u/5365992?v=4" width="75px">](https://github.com/rodrigobotti) |
| :-: |
| [Rodrigo Botti](https://github.com/rodrigobotti) |
