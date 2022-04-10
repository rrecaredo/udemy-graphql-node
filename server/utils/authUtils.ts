import { Context } from '..';
import JWT from 'jsonwebtoken';
import { JWT_SIGNATURE } from "../keys";

export type JWTData = {
    userId: string;
}

export type CanUserMutatePostParams = {
    userId: number,
    postId: number,
    prisma: Context['prisma']
}

export class AuthUtils {
    static getUserFromToken(token = ''): JWTData | null {
        try {
            const user = JWT.verify(token, JWT_SIGNATURE) as JWTData;
            return user;
        } catch (e) {
            return null;
        }
    }

    static get userNotLogged() {
        return {
            userErrors: [{ message: "You must be logged in to create a post" }],
            post: null,
        }
    }

    static async canUserMutatePost({ userId, postId, prisma }: CanUserMutatePostParams) {
        const post = await prisma.post.findUnique({
            where: {
                id: postId,
            },
        });

        return !!userId && post?.authorId === userId;
    }
}