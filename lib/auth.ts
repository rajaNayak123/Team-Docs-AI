// /lib/auth.ts (or wherever your authOptions are)

import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/models/User";

const client = new MongoClient(process.env.MONGODB_URI!);
const clientPromise = client.connect();

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          await connectDB();
          const user = await User.findOne({ email: credentials.email });

          if (!user || !user.password) {
            // User not found or is an OAuth user without a password
            return null;
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordValid) {
            return null;
          }
          
          // Return the full user object to be used in the jwt callback
          return user;

        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    // The 'user' object is only passed on the FIRST sign-in.
    // This callback runs for all providers (Credentials, Google, etc.).
    async jwt({ token, user }) {
      if (user) {
        // On initial sign-in, persist the custom data to the token
        token.id = user.id; // user.id comes from MongoDB (_id) or the provider
        token.teamId = user.teamId;
        token.role = user.role;
        token.isPro = user.isPro;
      }
      return token;
    },

    // The 'session' callback receives the token from the 'jwt' callback.
    // This is where you pass the data to the client-side session object.
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.teamId = token.teamId;
        session.user.role = token.role;
        session.user.isPro = token.isPro;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
};