import mongoose, { Schema, Document, Model } from "mongoose";

export interface IEnrollment extends Document {
    user: mongoose.Types.ObjectId;
    course: mongoose.Types.ObjectId;
    progress: number;
    completedLessons: mongoose.Types.ObjectId[];
    enrolledAt: Date;
    completedAt?: Date;
    lastAccessedAt: Date;
}

const enrollmentSchema = new Schema<IEnrollment>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        course: {
            type: Schema.Types.ObjectId,
            ref: "Course",
            required: true,
        },
        progress: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
        },
        completedLessons: {
            type: [Schema.Types.ObjectId],
            ref: "Lesson",
            default: [],
        },
        enrolledAt: {
            type: Date,
            default: Date.now,
        },
        completedAt: {
            type: Date,
        },
        lastAccessedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

// Compound index to ensure unique enrollment
enrollmentSchema.index({ user: 1, course: 1 }, { unique: true });

const Enrollment: Model<IEnrollment> = mongoose.models.Enrollment || mongoose.model<IEnrollment>("Enrollment", enrollmentSchema);

export default Enrollment;
