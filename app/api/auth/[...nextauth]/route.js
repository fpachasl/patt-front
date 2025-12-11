import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                try {
                    const baseUrl =
                        process.env.NEXTAUTH_URL || "http://localhost:3000";

                    const res = await axios.post(
                        `${baseUrl}/api/proxy/token`,
                        {
                            username: credentials.username,
                            password: credentials.password,
                        },
                        { timeout: 10000 }
                    );

                    const user = res.data;

                    if (user.access) {
                        return {
                            accessToken: user.access,
                            refreshToken: user.refresh,
                            username: credentials.username,
                            rol: user.rol_id,
                            id: user.id,
                        };
                    }

                    return null;
                } catch (err) {
                    console.error("LOGIN ERROR (authorize):", err);
                    return null;
                }
            },
        }),
    ],

    session: { strategy: "jwt" },

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.accessToken = user.accessToken;
                token.refreshToken = user.refreshToken;
                token.username = user.username;
                token.role = user.rol;
                token.user_id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            session.accessToken = token.accessToken;
            session.refreshToken = token.refreshToken;
            session.username = token.username;
            session.role = token.role;
            session.user_id = token.user_id;
            return session;
        },
    },

    pages: {
        signIn: "/",
    },

    secret: process.env.NEXTAUTH_SECRET,
});

export const GET = handler;
export const POST = handler;
