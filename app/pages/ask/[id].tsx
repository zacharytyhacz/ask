import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import type { NextPage } from 'next'
import { ProfileType, QuestionType } from 'ask.io' 
import Profile from '../../models/Profile'
import Question from '../../models/Question'
import { AskQuestionForm } from '../../components/AskQuestionForm'
import { LatestAskedQuestions } from '../../components/LatestAskedQuestions'

type Props = {
  profile: ProfileType
  latestQuestions: QuestionType[]
}

const AskProfile: NextPage<Props> = ({ profile, latestQuestions }) => {
    return (
      <div className="profile">
        <h1>{ profile.name }</h1>
        <p>{ profile.bio }</p>
        <AskQuestionForm questionFor={profile._id} />
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

  return {
    props: {
      profile: JSON.parse(JSON.stringify(profile)),
      latestQuestions: JSON.parse(JSON.stringify(latestQuestions)),
    }
  }
}

export default AskProfile
