import { Profile, Post } from "@prisma/client";
import { Context } from "..";

type UserParentType = {
    id: number;
}

export const User = {
    profile: async ({ id }: UserParentType, _: any, { prisma }: Context): Promise<Profile | null> => {
        return prisma.profile.findUnique({
            where: {
                userId: id,
            },
        });
    },
    posts: async ({ id }: UserParentType, _: any, { prisma, userInfo }: Context): Promise<Post[]> => {
        const isOwnProfile = Number(userInfo?.userId) === id;

        return prisma.post.findMany({
            where: {
                authorId: id,
                ...(isOwnProfile ? { published: true } : {}),
            },
            orderBy: [{
                createdAt: "desc",
            }],
        });
    }
};
