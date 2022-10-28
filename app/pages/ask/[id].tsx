import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import type { NextPage } from 'next'
import { useMemo } from 'react'
import { useSession } from "next-auth/react"
import { ProfileType, QuestionType } from 'ask.io' 
import Profile from '../../models/Profile'
import Question from '../../models/Question'
import { AskQuestionForm } from '../../components/AskQuestionForm'
import { LatestAskedQuestions } from '../../components/LatestAskedQuestions'
import { connectToDatabase } from '../../lib/connectToDatabase'

type Props = {
  profile: ProfileType
  latestQuestions: QuestionType[]
  numberOfAnsweredQuestions: number
  totalNumberOfQuestions: number
}

const AskProfile: NextPage<Props> = ({ profile, latestQuestions, numberOfAnsweredQuestions, totalNumberOfQuestions }) => {
    const session = useSession()

    const showQuestionForm = useMemo(() => {
      if (!session.data?.user?.id) {
        return false
      }

      return session.data.user.id !== profile._id
    }, [session, profile])

    return (
      <div className="profile">
        <div className="details">
          <h1>{ profile.name || 'Terry Davis'}</h1>
          <p>{ profile.bio }</p>
          <sub>{numberOfAnsweredQuestions} out of {totalNumberOfQuestions} question{totalNumberOfQuestions === 1 ? '' : 's'} answered.</sub>
        </div>
        { showQuestionForm && <AskQuestionForm questionFor={profile._id} /> }
        <LatestAskedQuestions questions={latestQuestions} />
      </div>
    )
}

export const getServerSideProps = async (
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<Props>> => {
  const id = context?.params?.id

  if (!id) {
    return {
      redirect: {
        destination: '/404',
        permanent: true
      }
    }
  }

  await connectToDatabase()

  let profile = await Profile.findOne({
    _id: id
  }).lean()

  if (!profile) {
    console.log('no profile')
    return {
      redirect: {
        destination: '/404',
        permanent: false
      }
    }
  }

  const latestQuestions = await Question.find({
    questionFor: id
  }).populate([
    {
      path: 'askedBy',
    },
    {
      path: 'questionFor',
    }
  ]).sort({ createdAt: 1 }).lean()

  const numberOfAnsweredQuestions = await Question.find({
    questionFor: id,
    answerText: {
      $exists: true
    }
  }).count()

  const totalNumberOfQuestions = await Question.find({
    questionFor: id,
  }).count()


  return {
    props: {
      profile: JSON.parse(JSON.stringify(profile)),
      latestQuestions: JSON.parse(JSON.stringify(latestQuestions)),
      numberOfAnsweredQuestions,
      totalNumberOfQuestions
    }
  }
}

export default AskProfile
