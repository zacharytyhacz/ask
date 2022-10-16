import React from 'react'

type Props = {
  questionFor: string
}

export const AskQuestionForm: React.FC<Props> = ({ questionFor }) => {
    return (
      <div className="ask-question-form-container">
        <form method="POST" action="/api/questions">
          <input type="hidden" name="questionFor" value={questionFor} />
          <label htmlFor="questionText">Ask this guy a question</label>
          <br />
          <textarea name="questionText" placeholder="Ask a question..." />
          <br />
          <button type="submit">Ask This Question</button>
        </form>
      </div>
    )
}

