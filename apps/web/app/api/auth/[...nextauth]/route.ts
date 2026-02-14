import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
        name: "Credentials",
        credentials: {
            email: { label: "Email", type: "text", placeholder: "Enter your email" },
            password: { label: "Password", type: "password" }
        },
        async authorize(credentials) {

            if(!credentials?.email || !credentials?.password){
                return null;
            }

            const user = await prisma.user.findUnique({
                where: {
                    email: credentials.email
                }
            });

            if(!user || !user.password){
                return null;
            }

            const isValid = await compare(credentials.password, user.password);

            if(!isValid){
                return null;
            }

            return {
                id: user.id,
                email: user.email,
                role: user.role
            };
        }
    })
  ],

  session: {
    strategy: "jwt"
  },

  callbacks: {
    async jwt({token, user}){
        if(user){
            token.userId = user.id;
            token.role = user.role;
        }

        return token;
    },

    async session({session, token}){
        if(session.user){
            session.user.id = token.userId as string;
            session.user.role = token.role as string;
        }

        return session;
    }
  },

  pages: {
    signIn: "/signin"
  },

  secret: process.env.NEXTAUTH_SECRET
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
