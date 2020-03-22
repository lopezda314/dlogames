const { GraphQLServer, PubSub } = require("graphql-yoga")
const Mutation = require("./resolvers/Mutation")
const Query = require("./resolvers/Query")
const Subscription = require("./resolvers/Subscription")
const db = require("./db")

// Creates GraphQL Yoga Server.
const pubsub = new PubSub()
function createServer() {
  return new GraphQLServer({
    typeDefs: "src/schema.graphql",
    resolvers: {
      Query,
      Mutation,
      Subscription,
    },
    resolverValidationOptions: {
      requireResolversForResolveType: false,
    },
    context: req => ({ ...req, db, pubsub }),
  })
}

module.exports = createServer
