import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { authConfig } from "./authconfig";
import { connectToDB } from "./lib/utils";
import { Admin } from "./lib/models/Admin";
import bcrypt from "bcryptjs";
const login = async (credentials) => {
    try {
        connectToDB();
        const user = await Admin.findOne({ username: credentials.username });

        if (!user || !user.isAdmin) {
            throw new Error("Username/Password is incorrect.");
        }

        const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
        );

        if (!isPasswordCorrect) {
            throw new Error("Username/Password is incorrect.");
        }

        return user;
    } catch (err) {
        throw new Error("Failed to login!");
    }
};

export const { signIn, signOut, auth } = NextAuth({
    ...authConfig,
    providers: [
        CredentialsProvider({
            async authorize(credentials) {
                try {
                    const user = await login(credentials);
                    return user;
                } catch (err) {
                    return null;
                }
            },
        }),
    ],
    // ADD ADDITIONAL INFORMATION TO SESSION
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.username = user.username;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.username = token.username;
            }
            return session;
        },
    },
});
