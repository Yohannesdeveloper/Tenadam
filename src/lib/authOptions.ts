import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { sql, isDbConfigured } from "@/lib/db";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET || "tenadam-dev-secret-change-me",
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Email and Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!isDbConfigured) return null;
        if (!credentials?.email || !credentials?.password) return null;

        const rows = await sql`
          SELECT id, email, name, password_hash
          FROM users
          WHERE lower(email) = ${credentials.email.toLowerCase()}
          LIMIT 1
        `;

        const found = rows[0];
        if (!found) return null;

        const isValid = await bcrypt.compare(credentials.password, found.password_hash);
        if (!isValid) return null;

        return {
          id: String(found.id),
          email: found.email,
          name: found.name ?? "",
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string }).id = token.id as string | undefined;
      }
      return session;
    },
  },
};
