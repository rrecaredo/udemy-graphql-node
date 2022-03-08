import { ApolloServer } from 'apollo-server';
import { typeDefs } from './graphql/typeDefs.js';
import { Query, Category, Product, Mutation } from './graphql/resolvers.js';
import { db } from './graphql/db.js';

const server = new ApolloServer({
    typeDefs,
    resolvers: {
        Query,
        Category,
        Product,
        Mutation
    }, context: {
        db,
    },
});

server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
});
