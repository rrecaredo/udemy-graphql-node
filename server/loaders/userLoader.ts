import { User } from '@prisma/client';
import DataLoader from "dataloader";
import { prisma } from "..";

type BatchUser = (userIds: number[]) => Promise<User[]>;

const batchUsers: BatchUser = async (userIds) => {
    const users = await prisma.user.findMany({
        where: {
            id: {
                in: userIds,
            },
        },
    });

    const userMap: { [key: number]: User } = {};

    users.forEach((user) => {
        userMap[user.id] = user;
    });

    return userIds.map((userId) => userMap[userId]);
}

// @ts-ignore
export const userLoader = new DataLoader<number, User>(batchUsers);