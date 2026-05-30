import mongoose from 'mongoose';

const canalSchema = new mongoose.Schema({
  name:              { type: String, required: true },
  categoria:         { type: String, required: true },
  emoji:             { type: String, default: '📡' },
  live:              { type: Boolean, default: false },
  youtubeChannelId:  { type: String, default: '' },
  youtubeVideoId:    { type: String, default: '' },
  url:               { type: String, default: '' },
}, { timestamps: true });

export default mongoose.model('Canal', canalSchema);
