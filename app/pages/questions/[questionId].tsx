import { NextPage, GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import { useMemo } from 'react'
import { useSession } from "next-auth/react"
import { QuestionType } from 'ask.io'
import Question from '../../models/Question'
import { connectToDatabase } from '../../lib/connectToDatabase'
import { Page } from '../../components/Page'

type Props = {
  question: QuestionType
}

const ViewQuestion: NextPage<Props> = ({ question }) => {
    const session = useSession()

    const showAnswerForm = useMemo(() => {
      if (!session.data?.user?.id) {
        return false
      }

      return session.data.user.id !== question.questionFor._id
    }, [session, question])

    return (
      <Page>
        <h1>{ question.questionTitle }</h1>
        <p>{ question.questionText }</p>
      </Page>
    )
}

export const getServerSideProps = async (
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<Props>> => {
  const questionId = context?.params?.questionId
  console.log({ questionId })

  if (!questionId) {
    return {
      redirect: {
        destination: '/404',
        permanent: true
      }
    }
  }

  await connectToDatabase()

  const question = await Question.findOne({
    _id: questionId
  }).populate([
    {
      path: 'askedBy',
    },
    {
      path: 'questionFor',
    }
  ]).sort({ createdAt: 1 }).lean()

  console.log('questino:', question)

  if (!question) {
    return {
      redirect: {
        destination: '/404',
        permanent: true
      }
    }
  }

  return {
    props: {
      question: JSON.parse(JSON.stringify(question))
    }
  }
}

export default ViewQuestion
