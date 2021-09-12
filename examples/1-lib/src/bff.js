const { AbortController } = require('abort-controller')

const { ApolloServer, gql } = require('apollo-server')
const fetch = require('node-fetch')
const CircuitBreaker = require('opossum')

const { logger } = require('./utils')

const typeDefs = gql`
  type User {
    id: String
    firstName: String
    lastName: String
    birthDate: String
  }

  type Address {
    addressLine1: String
    addressLine2: String
    state: String
    city: String
    country: String
    zipCode: String
  }

  type UserMessage {
    data: User
    errors: [String]!
  }

  type AddressMessage {
    data: Address
    errors: [String]!
  }

  type Profile {
    user: UserMessage
    address: AddressMessage
  }

  type Query {
    profile: Profile
  }
`

const rejectAsError = message =>
  Promise.reject(new Error(message))

const get = url => {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 300)

  return fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    signal: controller.signal,
  })
    .then(response => response.ok
      ? response.json()
      : response.text().then(rejectAsError)
    )
    .finally(() => clearTimeout(timeout))
}

const toErrorPayload = error => ({
  data: null,
  errors: [error.message],
})

const toResponsePayload = data => ({
  data,
  errors: [],
})

const useBreaker = () =>
  process.env.CIRCUIT_BREAKER_ENABLED === 'true'

const doGetUser = () =>
  get(`${process.env.USER_SERVICE_URL}/user`)
    .then(toResponsePayload)

const getUserCommand = new CircuitBreaker(doGetUser, {
  timeout: 300,
  errorThresholdPercentage: 10,
  resetTimeout: 30_000,
})

const getUser = () =>
  (useBreaker() ? getUserCommand.fire() : doGetUser())
    .catch(toErrorPayload)

const doGetAddress = () =>
  get(`${process.env.ADDRESS_SERVICE_URL}/address`)
    .then(toResponsePayload)

const getAddressCommand = new CircuitBreaker(doGetAddress, {
  timeout: 300,
  errorThresholdPercentage: 10,
  resetTimeout: 30_000,
})

const getAddress = () =>
  (useBreaker() ? getAddressCommand.fire() : doGetAddress())
    .catch(toErrorPayload)

const resolveProfile = () =>
  Promise
    .all([
      getUser(),
      getAddress(),
    ])
    .then(([user, address]) => ({
      user,
      address,
    }))

const resolvers = {
  Query: {
    profile: resolveProfile,
  }
}

const server = new ApolloServer({ typeDefs, resolvers })

server
  .listen(process.env.PORT)
  .then(({ url }) => logger.info(`Server ready at ${url}`))
