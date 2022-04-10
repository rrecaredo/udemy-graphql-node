import { AuthUtils } from '../../utils/authUtils';
import { Post } from "@prisma/client";
import { Context } from "../..";

type PostType = Pick<Post, "title" | "content">;

interface PostArgs {
    post: PostType;
}

interface PostPayloadType {
    userErrors: {
        message: string;
    }[],
    post: Post | null,
}

export const postResolvers = {
    postCreate: async (_: any, { post: { title, content } }: PostArgs, { prisma, userInfo }: Context): Promise<PostPayloadType> => {
        if (!userInfo) {
            return {
                userErrors: [{ message: "You must be logged in to create a post" }],
                post: null,
            };
        }

        if (!title || !content) {
            return {
                userErrors: [
                    {
                        message: "Title and content are required",
                    },
                ],
                post: null,
            };
        }

        const post = await prisma.post.create({
            data: {
                title,
                content,
                published: true,
                authorId: Number(userInfo.userId)
            },
        });

        return {
            post,
            userErrors: [],
        };
    },
    postUpdate: async (_: any, { post, postId }: { postId: string; post: PostType }, { prisma, userInfo }: Context): Promise<PostPayloadType> => {
        if (!userInfo) {
            return {
                userErrors: [{ message: "You must be logged in to update a post" }],
                post: null,
            };
        }

        const canUpdate = await AuthUtils.canUserMutatePost({ userId: Number(userInfo.userId), postId: Number(postId), prisma });

        if (!canUpdate) {
            return {
                userErrors: [
                    {
                        message: "You can only update your own posts",
                    },
                ],
                post: null,
            };
        }

        if (!post.title || !post.content) {
            return {
                userErrors: [
                    {
                        message: "Title and content are required",
                    },
                ],
                post: null,
            };
        }

        let payloadUpdate: Partial<PostType> = {};

        if (post.title) payloadUpdate.title = post.title;
        if (post.content) payloadUpdate.content = post.content;

        const updatedPost = await prisma.post.update({
            where: {
                id: Number(postId),
            },
            data: payloadUpdate,
        });

        return {
            post: updatedPost,
            userErrors: [],
        };
    },
    deletePost: async (_: any, { postId }: { postId: string }, { prisma }: Context): Promise<PostPayloadType> => {
        const post = await prisma.post.findUnique({
            where: {
                id: Number(postId),
            },
        });

        if (!post) {
            return {
                userErrors: [
                    {
                        message: "Post not found",
                    },
                ],
                post: null,
            };
        }

        await prisma.post.delete({
            where: {
                id: Number(postId),
            },
        });

        return {
            post,
            userErrors: [],
        };
    },
    postPublish: async (_: any, { postId }: { postId: string }, { prisma, userInfo }: Context): Promise<PostPayloadType> => {
        if (!userInfo) {
            return {
                userErrors: [{ message: "You must be logged in to publish a post" }],
                post: null,
            };
        }

        const canUpdate = await AuthUtils.canUserMutatePost({ userId: Number(userInfo.userId), postId: Number(postId), prisma });

        if (!canUpdate) {
            return {
                userErrors: [
                    {
                        message: "You can only publish your own posts",
                    },
                ],
                post: null,
            };
        }

        const post = await prisma.post.update({
            where: {
                id: Number(postId),
            },
            data: {
                published: true,
            },
        });

        return {
            post,
            userErrors: [],
        };
    },
    postUnpublish: async (_: any, { postId }: { postId: string }, { prisma, userInfo }: Context): Promise<PostPayloadType> => {
        if (!userInfo) {
            return {
                userErrors: [{ message: "You must be logged in to unpublish a post" }],
                post: null,
            };
        }

        const canUpdate = await AuthUtils.canUserMutatePost({ userId: Number(userInfo.userId), postId: Number(postId), prisma });

        if (!canUpdate) {
            return {
                userErrors: [
                    {
                        message: "You can only unpublish your own posts",
                    },
                ],
                post: null,
            };
        }

        const post = await prisma.post.update({
            where: {
                id: Number(postId),
            },
            data: {
                published: false,
            },
        });

        return {
            post,
            userErrors: [],
        };
    }
}