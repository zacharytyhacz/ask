declare module "ask.io" {
  interface ProfileType {
    _id: string
    name: string
    bio: string
  }

  interface QuestionType {
    _id: string
    questionFor: ProfileType
    questionText: string
    askedBy: ProfileType
    answerText?: string
    createdAt: Date
    updatedAt: Date
  }
}
