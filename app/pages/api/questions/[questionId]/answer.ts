import type { NextApiRequest, NextApiResponse } from 'next'
import { unstable_getServerSession } from "next-auth/next"
import { authOptions } from '../../auth/[...nextauth]'
import Question from '../../../../models/Question'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await unstable_getServerSession(
    req,
    res,
    authOptions
  )

  const { questionId } = req.query

  if (
    req.method !== 'POST' ||
    !req.body ||
    !session ||
    !session.user ||
    !questionId
  ) {
    return res.status(404).redirect('/404')
  }

  const { body } = req

  const questionToBeAnswered = await Question.findOne({
    _id: questionId,
    questionFor: session?.user?.id
  })

  if (!questionToBeAnswered) {
    return res.status(404).redirect('/404')
  }

  if (questionToBeAnswered.answertext) {
    return res.status(400).json({
      error: 'Question already answered.'
    })
  }

  if (!body.answerText) {
    return res.status(400).json({
      error: 'Answer text is required.'
    })
  }

  await Question.updateOne({
    answerText: body.answerText
  })

  res.status(200).redirect(`/ask/${questionToBeAnswered.questionFor}`)
}
