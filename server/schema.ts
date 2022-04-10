import { Post } from '.prisma/client';
import { gql } from 'apollo-server';

export const typeDefs = gql`
    type Query {
        me: User
        posts: [Post!]!
        profile(userId: ID!): Profile
    }

    type Mutation {
        postCreate(post: PostInput): PostPayload!
        postUpdate(postId: ID!, post: PostInput!): PostPayload!
        deletePost(postId: ID!): PostPayload!
        signup(name: String!, bio: String!, credentials: CredentialsInput): AuthPayload!
        signin(credentials: CredentialsInput): AuthPayload!
        postPublish(postId: ID!): PostPayload!
        postUnpublish(postId: ID!): PostPayload!
    }

    type Post {
        id: ID!
        title: String!
        content: String!
        createdAt: String!
        published: Boolean!
        user: User!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        posts: [Post!]!
        profile: Profile!
    }

    type Profile {
        id: ID!
        user: User!
        bio: String!
    }

    type UserError {
        message: String!
    }

    type PostPayload {
        post: Post
        userErrors: [UserError!]!
    }

    type AuthPayload {
        userErrors: [UserError!]!
        token: String!
    }

    type SignupPayload {
        user: User
        userErrors: [UserError!]!
    }

    input PostInput {
        title: String,
        content: String
    }

    input CredentialsInput {
        email: String!
        password: String!
    }
`;