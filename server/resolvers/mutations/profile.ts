import { Post, User } from "@prisma/client";
import { Context } from "../..";

type ProfileParentType = {
    id: number;
    bio: string;
    userId: number;
}

export const profileResolvers = {
    user: async ({ userId }: ProfileParentType, _: any, { prisma }: Context): Promise<User|null> => {
        return prisma.user.findUnique({
            where: {
                id: userId,
            },
        });
    }
};
