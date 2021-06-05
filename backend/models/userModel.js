import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const userSchema = new Schema({
  userName: {
    type: String,
    required: true,
    trim: true,
    minlength: 3
  },
  emailId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  studCode:{
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  }
}, {
  timestamps: true,
});

const User = mongoose.model('User', userSchema);

export default User;