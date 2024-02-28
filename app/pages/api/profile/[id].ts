import type { NextApiRequest, NextApiResponse } from 'next'
import { unstable_getServerSession } from "next-auth/next"
import { authOptions } from '../auth/[...nextauth]'
import Profile from '../../../models/Profile'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await unstable_getServerSession(
    req,
    res,
    authOptions
  )

  const { id } = req.query

  console.log('body:', req.body)

  if (
    req.method !== 'POST' ||
    !req.body ||
    !session ||
    !session.user ||
    !id
  ) {
    console.log({
      method: req.method,
      body: req.body,
      session,
      user: session?.user,
      id
    })

    return res.status(404).redirect('/404')
  }

  if (id.toString() !== session.user.id.toString()) {
    console.log(id, session.user.id)
    return res.status(404).redirect('/404')
  }

  const { body } = req

  const updates: {
    name?: string
    bio?: string
  } = {}

  if (body.name) {
    updates.name = body.name
  }

  if (body.bio) {
    updates.bio = body.bio
  }

  await Profile.updateOne({
    _id: id
  }, {
    $set: updates
  })

  return res.status(200).redirect(`/ask/${id}`)
}
