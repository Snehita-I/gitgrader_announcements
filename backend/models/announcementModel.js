import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const announcementSchema = new Schema({
    announcementCode: { type: String, required: true, unique:true},
  announcementText: { type: String, required: true },
  courseCode: {type: String, required:true},
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

const Announcement = mongoose.model('Announcement', announcementSchema);

export default Announcement;