import { ApolloServer } from 'apollo-server';
import { Query, Mutation } from './resolvers';
import { typeDefs } from './schema';
import { Prisma, PrismaClient } from '@prisma/client'
import { AuthUtils, JWTData } from './utils/authUtils';

const prisma = new PrismaClient();

export interface Context {
    prisma: PrismaClient<Prisma.PrismaClientOptions, never, Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined>,
    userInfo: JWTData | null
}

const server = new ApolloServer({
    typeDefs,
    resolvers: {
        Query,
        Mutation
    },
    context: ({ req }): Context => {
        const userInfo = AuthUtils.getUserFromToken(req.headers.authorization);
        return {
            prisma,
            userInfo
        }
    }
})

server.listen().then(({ url }) => {
    console.log(`Server ready on ${url}`);
});
