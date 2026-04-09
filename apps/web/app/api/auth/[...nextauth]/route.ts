import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

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

            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
                    method: "POST",
                    headers: {
                    "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: credentials.email,
                        password: credentials.password
                    })
                });

                const data = await response.json();

                if(!response.ok){
                    return null;
                }

                return {
                    id: data.user.id,
                    email: data.user.email,
                    role: data.user.role
                };

            } catch (error) {
                console.error("Error during authentication:", error);
                return null;
            }
        }
    })
  ],

  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 10
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
