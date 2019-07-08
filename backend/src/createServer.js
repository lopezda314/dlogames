const { GraphQLServer } = require('graphql-yoga');
const Mutations = require('./resolvers/Mutations');
const Query = require('./resolvers/Query');
const db = require('./db');

// Creates GraphQL Yoga Server.

function createServer() {
    return new GraphQLServer({
        typeDefs: 'src/schema.graphql',
        resolvers: {
            Query,
            Mutations,
        },
        resolverValidationOptions: {
            requireResolversForResolveType: false,
        },
        context: req => ({...req, db }),
    });
}

module.exports = createServer;