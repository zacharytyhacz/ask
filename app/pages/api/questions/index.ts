// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { unstable_getServerSession } from "next-auth/next"
import { faker } from '@faker-js/faker'
import { authOptions } from '../auth/[...nextauth]'
import Question from '../../../models/Question'
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

  switch(req.method) {
    case 'GET':
      const limit = Number(req.query.limit ?? 8)
      const skip = Number(req.query.skip ?? 0)
      const total = await Question.count()

      const hasMore = skip * limit < total
      const questions = await Question.find({}).populate([
        {
          path: 'askedBy'
        },
        {
          path: 'questionFor'
        },
      ]).sort({ createdAt: -1 }).skip(skip).limit(limit).lean()
      return res.json({
        hasMore,
        questions
      })
    case 'POST':
      if (
        !req.body ||
        !session ||
        !session.user
      ) {
        return res.status(404).redirect('/404')
      }

      const { body } = req

      const numberOfProfiles = 500

      for(let i = 0; i < numberOfProfiles; i++) {
        await Profile.create({
          name: faker.internet.userName(),
          bio: faker.company.catchPhrase(),
          createdAt: faker.date.recent(365)
        })
      }

      const allProfiles = await Profile.find({})

      const numberOfQuestions = 2000
      for(let i = 0; i < numberOfQuestions; i++) {
        const questionFor = allProfiles[faker.datatype.number({ min: 0, max: allProfiles.length - 1 })]
        const askedBy = allProfiles[faker.datatype.number({ min: 0, max: allProfiles.length - 1 })]

        await Question.create({
          questionFor: questionFor._id,
          questionText: faker.lorem.sentences(
            faker.datatype.number({ min: 1, max: 4 })
          ),
          askedBy: askedBy._id,
          answerText: faker.datatype.boolean() ? faker.company.catchPhrase() : undefined,
          createdAt: faker.date.recent(365)
        })
      }

      await Question.create({
        questionFor: body.questionFor,
        questionText: body.questionText,
        askedBy: session?.user?.id
      })

      res.status(201).redirect(`/ask/${req.body.questionFor}`)
    default: 
      return res.status(404).redirect('/404')
  }
}
