![](https://storage.googleapis.com/golden-wind/experts-club/capa-github.svg)

# Exemplo 1: Circuit Breaker - biblioteca local

![](/.github/assets/example-1.png)

Neste exemplo teremos um sistema com a seguinte arquitetura:

- User Service:
    - API REST
    - implementado em Node.JS
    - retorna dados pessoais fictícios de um possível usuário

- Address Service:
    - API REST
    - implementado em Node.JS
    - retorna um endereço fictício de um possível usuário

- BFF Service:
    - API [GraphQL](https://graphql.org/)
    - implementado em Node.JS
    - usando [Apollo Server](https://www.apollographql.com/docs/apollo-server/)
    - retorna um perfil fictício de um usuário que consiste dos dados pessoas e endereço que são buscados no _user service_ e _address service_ respectivamente 
    - chamadas http aos serviços são protegidas por `circuit breakers` utilizando a lib [Opossum](https://nodeshift.dev/opossum/)

## Execução local

O sistema é _deployado_ localmente utilizando _docker_ e _docker-compose_.

### Comandos

O exemplo utiliza `make` como task manager. 
Os targets estão definidos no [Makefile](./Makefile).

```sh
# builda todas as imagens e sobe os serviços dentro de uma mesma rede
make start

# reinicia cada serviço
make start/address
make start/bff
make start/user

# derruba cada serviço
make stop/address
make stop/user

# tail do log de cada serviço
make logs/address
make logs/bff
make logs/user

# gera carga de requisições ao bff utilizando apache benchmark
make test

# mostra o consumo de recursos do container do BFF
make resources

# derruba toda a infraestrutura
make stop
```

## Variáveis de ambiente

No [docker-compose.yml](./docker-compose.yml) podemos alterar as variáveis de ambiente de cada serviço.

- Address Service
    - `FORCED_DELAY`: tempo em milisegundos que serviço espera para retornar uma resposta a requisições http
- User Service
    - `FORCED_DELAY`: tempo em milisegundos que serviço espera para retornar uma resposta a requisições http
- BFF Service
    - `CIRCUIT_BREAKER_ENABLED`: `true` ou `false` - habilita ou desabilita o uso de _circuit breaker_ nas chamadas aos outros serviços
    - `ADDRESS_SERVICE_URL`: URL do address service
    - `USER_SERVICE_URL`: URL do user service


## Referências
- https://martinfowler.com/bliki/CircuitBreaker.html
- https://docs.microsoft.com/en-us/azure/architecture/patterns/circuit-breaker
- https://nodeshift.dev/opossum/
- https://graphql.org/
- https://www.apollographql.com/docs/apollo-server/


## Expert

| [<img src="https://avatars.githubusercontent.com/u/5365992?v=4" width="75px">](https://github.com/rodrigobotti) |
| :-: |
| [Rodrigo Botti](https://github.com/rodrigobotti) |
