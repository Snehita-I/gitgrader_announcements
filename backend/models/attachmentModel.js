import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const attachmentSchema = new Schema({
  studCode: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  file: {
    type:String,
    required:true,
    trim:true
  },
  fileType: {
    type:String,
    trim:true
  },
  plagarismPercent: {
    type:Number
  }

}, {
  timestamps: true,
});

const Attachment = mongoose.model('Attachment', attachmentSchema);

export default Attachment;