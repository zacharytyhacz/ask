import React, { useCallback } from 'react'
import Link from 'next/link'
import { useSession } from "next-auth/react"
import { QuestionType } from 'ask.io'
import { AnswerQuestionForm } from '../AnswerQuestionForm'

type Props = {
  questions: QuestionType[]
}

export const LatestAskedQuestions: React.FC<Props> = ({ questions }) => {
  const session = useSession()

  const iCanAnswerThisQuestion = useCallback((question: QuestionType) => {
    if (session.status !== 'authenticated') {
      return false
    }

    return question.questionFor._id === session?.data?.user?.id
  }, [session])

  return (
    <div className="questions-container">
      {
        questions.map((question) => (
          <>
            <div className="asked-question" key={question._id}>
              <br />
              { question.questionText }
              <br />
              <br />
              <div className="asked-by">
                <a href={`/ask/${question.askedBy._id}`}>
                    { question.askedBy.name }
                </a> asked <a href={`/ask/${question.questionFor._id}`}>
                    { question.questionFor.name }
                </a>
              </div>
              { !question.answerText && iCanAnswerThisQuestion(question) && (
                <AnswerQuestionForm question={question} />
              )}
              { !question.answerText && !iCanAnswerThisQuestion(question) && (
                <h5>No answer yet.</h5>
              )}
              { question.answerText && <h4 className="answer-text">{ question.answerText }</h4> }
              <sub>
                Asked on { new Date(question.createdAt).toDateString() }
              </sub>
            </div>
            <hr />
          </>
        ))
      }
    </div>
  )
}

