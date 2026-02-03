import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICourse extends Document {
    title: string;
    description: string;
    thumbnail?: string;
    instructor: mongoose.Types.ObjectId;
    price: number;
    level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
    category: string;
    tags: string[];
    status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
    duration?: number;
    enrollmentCount: number;
    rating: number;
    reviewCount: number;
    createdAt: Date;
    updatedAt: Date;
}

const courseSchema = new Schema<ICourse>(
    {
        title: {
            type: String,
            required: [true, "Course title is required"],
            trim: true,
            minlength: 5,
        },
        description: {
            type: String,
            required: [true, "Course description is required"],
            minlength: 20,
        },
        thumbnail: {
            type: String,
        },
        instructor: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
            default: 0,
        },
        level: {
            type: String,
            enum: ["BEGINNER", "INTERMEDIATE", "ADVANCED"],
            required: true,
        },
        category: {
            type: String,
            required: true,
            trim: true,
        },
        tags: {
            type: [String],
            default: [],
        },
        status: {
            type: String,
            enum: ["DRAFT", "PUBLISHED", "ARCHIVED"],
            default: "DRAFT",
        },
        duration: {
            type: Number,
            min: 1,
        },
        enrollmentCount: {
            type: Number,
            default: 0,
        },
        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },
        reviewCount: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes for better query performance
courseSchema.index({ instructor: 1, status: 1 });
courseSchema.index({ category: 1, level: 1 });
courseSchema.index({ title: "text", description: "text" });

const Course: Model<ICourse> = mongoose.models.Course || mongoose.model<ICourse>("Course", courseSchema);

export default Course;
