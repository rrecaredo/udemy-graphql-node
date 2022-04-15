import { User } from "@prisma/client";
import { Context } from "..";
import { userLoader } from "../loaders/userLoader";

type PostParentType = {
    authorId: number;
}

export const Post = {
    user: async ({ authorId }: PostParentType, _: any, { prisma }: Context): Promise<User|null> => {
        return userLoader.load(authorId);
    }
};
