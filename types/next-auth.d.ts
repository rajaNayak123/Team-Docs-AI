declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name: string
      email: string
      teamId: string
      role: string
      isPro: boolean
    }
  }

  interface User {
    teamId: string
    role: string
    isPro: boolean
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    teamId: string
    role: string
    isPro: boolean
  }
}
