import mongoose from 'mongoose'

const { Schema } = mongoose

const profileSchema: mongoose.Schema = new Schema({
    name: { type: String, required: true, unique: true },
    bio: { type: String, required: false, default: 'I am a professional operating system developer. In 1990, I was hired to work on Ticketmaster’s VAX operating system.' },
}, { timestamps: true })

export default mongoose.models.Profile || mongoose.model('Profile', profileSchema)
