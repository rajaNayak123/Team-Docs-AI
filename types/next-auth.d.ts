// next-auth.d.ts

import { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      teamId?: string;
      role?: string;
      isPro?: boolean;
    } & DefaultSession["user"]; // Keep the default properties
  }

  interface User extends DefaultUser {
    // Add your custom properties to the User object
    teamId?: string;
    role?: string;
    isPro?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    // Add your custom properties to the JWT
    id: string;
    teamId?: string;
    role?: string;
    isPro?: boolean;
  }
}