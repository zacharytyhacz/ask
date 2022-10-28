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

          const profileExists = await Profile.findOne({ _id: user.id })

          if (!profileExists) {
            await Profile.create({
              _id: user.id,
              name: user.email?.split('@')[0] ?? `Terry Davis ${parseInt((Math.random() * 1000000).toString())}`
            })
          }

          return session
        }
    }
}

export default NextAuth(authOptions)
