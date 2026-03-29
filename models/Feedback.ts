import mongoose, { Schema, Document, Model } from "mongoose";

export interface IFeedback extends Document {
  timestamp: number;
  date: string;
  helpful: string | null;
  features: string[];
  rating: number | null;
  message: string;
  requestedFeature: string;
  email?: string;
}

const FeedbackSchema: Schema = new Schema({
  timestamp: { type: Number, required: true },
  date: { type: String, required: true },
  helpful: { type: String, default: null },
  features: [{ type: String }],
  rating: { type: Number, default: null },
  message: { type: String, maxlength: 2000 },
  requestedFeature: { type: String, maxlength: 500 },
  email: { type: String },
});

const Feedback: Model<IFeedback> =
  mongoose.models.Feedback || mongoose.model<IFeedback>("Feedback", FeedbackSchema);

export default Feedback;
