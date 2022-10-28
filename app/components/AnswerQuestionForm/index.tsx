import React from 'react'
import { QuestionType } from 'ask.io'

type Props = {
  question: QuestionType
}

export const AnswerQuestionForm: React.FC<Props> = ({ question }) => {
    return (
      <div className="answer-question-form-container">
        <br />
        <form method="POST" action={`/api/questions/${question._id}/answer`}>
          <label htmlFor="answerText">Got an answer?</label>
          <br />
          <textarea name="answerText" placeholder="Type your answer here..." rows={8} />
          <br />
          <button type="submit">
            Submit Answer
          </button>
        </form>
      </div>
    )
}

