import bcrypt from 'bcryptjs';
import validator from 'validator';
import JWT from 'jsonwebtoken';
import { Context } from "../..";
import { JWT_SIGNATURE } from '../../keys';

interface Credentials {
    email: string;
    password: string;
}

interface SignupArgs {
    credentials: Credentials;
    name: string;
    bio: string;
}

interface SigninArgs {
    credentials: Credentials;
}

interface AuthPayload {
    userErrors: {
        message: string;
    }[],
    token: string | null
}

const buildErrorResponse = (message: string): AuthPayload => ({
    userErrors: [{ message }],
    token: null,
})

export const authResolvers = {
    signup: async (_: any, { name, bio, credentials: { email, password } }: SignupArgs, { prisma }: Context): Promise<AuthPayload> => {
        const isEmail          = validator.isEmail(email);
        const isPasswordStrong = validator.isLength(password, { min: 5 });

        if (!isEmail) return buildErrorResponse('Email is invalid');
        if (!isPasswordStrong) return buildErrorResponse('Password is not strong enough');

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });

        await prisma.profile.create({
            data: {
                bio,
                userId: user.id,
            }
        });

        const token = JWT.sign({ userId: user.id }, JWT_SIGNATURE);

        return {
            userErrors: [],
            token
        }
    },
    signin: async (_: any, { credentials: { email, password } }: SigninArgs, { prisma }: Context): Promise<AuthPayload> => {
        const user = await prisma.user.findUnique({
            where: {
                email,
            }
        });

        if (!user) return buildErrorResponse('Email or password is incorrect');

        const passwordValid = await bcrypt.compare(password, user.password);

        if (!passwordValid) return buildErrorResponse('Email or password is incorrect');

        const token = JWT.sign({ userId: user.id }, JWT_SIGNATURE);

        return {
            userErrors: [],
            token
        }
    }
};