
import mongoose from 'mongoose'

const { Schema } = mongoose

const questionSchema: mongoose.Schema = new Schema({
    questionFor: { type: mongoose.Types.ObjectId, ref: 'Profile', required: true },

    askedBy: { type: mongoose.Types.ObjectId, ref: 'Profile', required: true },

    questionText: { type: String, required: true },

    answerText: { type: String, required: false }
}, { timestamps: true })

export default mongoose.models.Question || mongoose.model('Question', questionSchema)
