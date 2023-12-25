import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { authConfig } from "./authconfig";
import { connectToDB } from "./lib/utils";
import { Admin } from "./lib/models/Admin";
import bcrypt from "bcrypt";
const login = async (credentials) => {
    try {
        connectToDB();
        const user = await Admin.findOne({ username: credentials.username });

        if (!user || !user.isAdmin) {
            console.log("hi from user is not there");
            throw new Error("Username/Password is incorrect.");
        }

        const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
        );

        if (!isPasswordCorrect) {
            console.log("hi from password is incorrect");
            throw new Error("Username/Password is incorrect.");
        }

        return user;
    } catch (err) {
        console.log(err);
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
