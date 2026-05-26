import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "./prisma";

// NextAuth config for Indulge.
// Two kinds of users sign in here:
//   - ADMIN (salon owner / Eboni)
//   - CLIENT (members who chose to create an account)
//
// Guests do NOT use this; they book without an account.
//
// Password is hashed with bcrypt in /api/auth/signup, and verified here.
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase().trim() },
        });

        // No user, or no password set (e.g. legacy/empty account): refuse.
        if (!user || !user.password) {
          return null;
        }

        // Verify the password using bcrypt.
        const ok = await bcrypt.compare(credentials.password, user.password);
        if (!ok) {
          return null;
        }

        // Successful login. Return the user (NextAuth will drop the password
        // when serializing into the JWT/session).
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        } as any;
      },
    }),
  ],
  callbacks: {
    // Attach id + role onto the JWT so we can use them on the server.
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
        token.role = (user as any).role;
      }
      return token;
    },
    // Mirror id + role onto the session so client components can read them.
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
};
