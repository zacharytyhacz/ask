import type { NextPage, GetServerSidePropsContext } from 'next'
import { useState, useEffect } from 'react'
import Head from 'next/head'
import InfiniteScroller from 'react-infinite-scroller'
import { QuestionType } from 'ask.io'
import { LatestAskedQuestions } from '../components/LatestAskedQuestions'
import { Page } from '../components/Page'
// import Question from '../models/Question'

type Props = {
  latestQuestions: QuestionType[]
}

const Home: NextPage<Props> = ({ latestQuestions }) => {
  const [visibleQuestions, setVisibleQuestions] = useState<QuestionType[]>(latestQuestions)
  const [skip, setSkip] = useState(8)
  const [hasMore, setHasMore] = useState(false)
  const limit = 8

  useEffect(() => {
    const params = {
      skip: skip.toString(),
      limit: limit.toString()
    }

    fetch(`/api/questions?${new URLSearchParams(params)}`)
      .then((res) => res.json())
      .then((data: {
        hasMore: boolean,
        questions: QuestionType[]
      }) => {
        setVisibleQuestions((prev) => [
          ...prev,
          ...data.questions
        ])
        setHasMore(data.hasMore)
     })
  }, [skip])

  return (
    <>
      <Head>
        <title>ask.io</title>
        <meta charSet="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"/>
        <meta name="description" content="Ask developers questions"/>
      </Head>
      <Page>
        <div className="home">
          <h1>Ask</h1>
          <h2>or</h2>
          <h1>Answer</h1>
          <InfiniteScroller
            pageStart={1}
            initialLoad={false}
            loadMore={() => setSkip((prev) => {
              console.log('PAGE: ', prev)
              return prev + 1
            })}
            hasMore={hasMore}
            loader={<div className="loading-more-questions">Find more questions...</div>}
          >
            <LatestAskedQuestions questions={visibleQuestions} />
          </InfiniteScroller>
        </div>
      </Page>
    </>
  )
}
export default Home

export const getServerSideProps = async () => {
  console.log('here')
  // const latestQuestions = await Question.find({
  //   answerText: null
  // }).populate([
  //   {
  //     path: 'askedBy',
  //   },
  //   {
  //     path: 'questionFor',
  //   }
  // ]).sort({ createdAt: 1 }).skip(0).limit(8).lean()

  return {
    props: {
      latestQuestions: []
    }
  }
}
