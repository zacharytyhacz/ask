import NextAuth, { NextAuthOptions } from "next-auth"
import EmailProvider from "next-auth/providers/email"
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import { connectToDatabase } from '../../../lib/connectToDatabase'
import Profile from '../../../models/Profile'

export const authOptions: NextAuthOptions = {
    adapter: MongoDBAdapter((async () => {
        const connection = await connectToDatabase()
        return connection.connection.getClient() })()
    ),

    providers: [
        EmailProvider({
            server: {
                host: process.env.EMAIL_SERVER_HOST,
                port: process.env.EMAIL_SERVER_PORT,
                auth: {
                    user: process.env.EMAIL_SERVER_USER,
                    pass: process.env.EMAIL_SERVER_PASSWORD
                }
            },
            from: process.env.EMAIL_FROM,
        })
    ],

    pages: {
        signIn: '/continue'
    },

    callbacks: {
        session: async ({ session, user }) => {
          session.user = user

          console.log('IN CALLBACK', user)

          const profileExists = await Profile.exists({ _id: user.Id })

          if (!profileExists) {
            await Profile.create({
              _id: user.id
            })
          }

          return session
        }
    }
}

export default NextAuth(authOptions)
