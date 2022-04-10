import { Post, Profile, User } from "@prisma/client";
import { Context } from "..";

export const Query = {
    posts: async (_: any, __: any, { prisma }: Context): Promise<Post[]> => {
        return prisma.post.findMany({
            orderBy: [{
                createdAt: "desc",
            }]
        });
    },
    me: async (_: any, __: any, { prisma, userInfo }: Context): Promise<User|null> => {
        if (!userInfo) return null;

        return prisma.user.findUnique({
            where: {
                id: Number(userInfo.userId),
            },
        });
    },
    profile: async (_: any, { userId }: { userId: string }, { prisma }: Context): Promise<Profile|null> => {
        return prisma.profile.findUnique({
            where: {
                userId: Number(userId),
            },
        });
    }
};
