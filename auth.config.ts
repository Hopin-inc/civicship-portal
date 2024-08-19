import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { auth } from "@/lib/firebase";

export const authConfig: NextAuthOptions = {
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "LINE",
      credentials: {
        idToken: {},
      },
      authorize: async ({ idToken }) => {
        if (idToken) {
          try {
            const decoded = await auth.verifyIdToken(idToken);
            return { ...decoded };
          } catch (err) {
            console.error(err);
          }
        }
        return null;
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user, account, profile, trigger }) => {
      return { ...token, ...user };
    },
    session: async ({ session, token }) => {
      session.user.emailVerified = token.emailVerified;
      session.user.uid = token.uid;
      return session;
    }
  },
};
