import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const assignmentSchema = new Schema({
  assignmentCode: { type: String, required: true, unique:true},
  description: { type: String, required: true },
  title: {type:String, required: true},
  courseCode: {type: String, required:true},
  dueDate: { type: Date, required: true },
  allowLate: { type: Boolean ,required: true},
  penality: {type: Number, require: true},
  lateDueDate: {type: Date, required:true},
  allowedPlagrismPercent: {type: Number,required:false},
  keywordsUri: {type:String,required:false},
  allowedFileType: [{type:String,required:false}], 
  attachments:[
    {
      type: Schema.Types.ObjectId,
      ref: 'Attachment',
      required:false
    }
  ],
  users:[
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required:false
    }
  ]
}, {
  timestamps: true,
});

const Assignment = mongoose.model('Assignment', assignmentSchema);

export default Assignment;