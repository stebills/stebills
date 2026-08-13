import mongoose, { Schema, Document } from 'mongoose';

interface INotification extends Document {
  userId: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

const notificationSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
}, {timestamps: true});

const Notification = mongoose.model<INotification>('Notification', notificationSchema);
export default Notification;
