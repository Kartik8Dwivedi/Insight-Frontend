import mongoose, { Schema, Document, Model } from "mongoose";

export interface IEvent extends Document {
  t: number;
  type: string; // 'pageview' | 'session_end' | 'filter_used' | 'ai_search' | 'feedback_opened' | 'click'
  sessionId: string;
  page?: string;
  referrer?: string;
  duration?: number; // seconds
  meta: Record<string, any>;
  isMobile: boolean;
}

const EventSchema: Schema = new Schema({
  t: { type: Number, required: true, index: true },
  type: { type: String, required: true, index: true },
  sessionId: { type: String, required: true, index: true },
  page: { type: String },
  referrer: { type: String },
  duration: { type: Number },
  meta: { type: Schema.Types.Mixed },
  isMobile: { type: Boolean, default: false },
});

// Index for daily aggregations
EventSchema.index({ t: -1 });

const Event: Model<IEvent> =
  mongoose.models.Event || mongoose.model<IEvent>("Event", EventSchema);

export default Event;
