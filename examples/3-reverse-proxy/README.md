![](https://storage.googleapis.com/golden-wind/experts-club/capa-github.svg)

# Exemplo 3: Circuit Breaker - proxy reverso

![](/.github/assets/example-3.png)

Neste exemplo teremos um sistema com a seguinte arquitetura:

- Backend Service:
    - API REST
    - implementado em Node.JS
    - retorna uma profissão fictícia de um possível usuário
    - _deployado_ em duas replicas:
        - _node-1_ funciona normalmente
        - _node-2_ sempre retorna erro 500

- Reverse Proxy:
    - [HAProxy](https://www.haproxy.org/)
    - Proxy reverso na frente das replicas do _backend service_:
        - `${reverse proxy}/backend` mapeia para `${backend service}/`
        - faz load balancing round robin entre as replicas
        - protege as chamadas http com `circuit breaker`

- Client Service:
    - API REST
    - implementado em Node.JS
    - chama o backend service através do _reverse proxy_

## Execução local

O sistema é _deployado_ localmente utilizando _docker_ e _docker-compose_.

### Comandos

O exemplo utiliza `make` como task manager. 
Os targets estão definidos no [Makefile](./Makefile).

```sh
# builda todas as imagens e sobe os serviços dentro de uma mesma rede
make start

# gera carga de requisições ao client service com curl
make test

# abre a página de status do HAProxy no browser
make stats/haproxy

# derruba toda a infraestrutura
make stop
```

## Referências
- https://martinfowler.com/bliki/CircuitBreaker.html
- https://docs.microsoft.com/en-us/azure/architecture/patterns/circuit-breaker
- https://www.haproxy.com/blog/circuit-breaking-haproxy/


## Expert

| [<img src="https://avatars.githubusercontent.com/u/5365992?v=4" width="75px">](https://github.com/rodrigobotti) |
| :-: |
| [Rodrigo Botti](https://github.com/rodrigobotti) |
