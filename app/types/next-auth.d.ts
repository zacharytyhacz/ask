import NextAuth from "next-auth"

declare module "next-auth" {
  interface User extends NextAuth.User {
      id: string
      image: string
  }
  interface Session extends NextAuth.Session {
    user: User
  }
}
