import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
      required: [true, 'Student ID is required'],
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'User name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
    },
    role: {
      type: String,
      enum: ['STUDENT', 'ADMIN', 'FACILITY_STAFF'],
      default: 'STUDENT',
    },
    department: {
      type: String,
      default: 'Lovely Professional University — School of Computer Science & Engineering',
    },
    academicStanding: {
      type: String,
      enum: ['Undergraduate', "Master's Degree", 'Doctoral / PhD', 'Faculty / Postdoc'],
      default: 'Undergraduate',
    },
    rfidCardUid: {
      type: String,
      sparse: true,
    },
    weeklyQuotaHours: {
      type: Number,
      default: 25.0,
    },
    usedQuotaHours: {
      type: Number,
      default: 0.0,
    },
    noShowStrikes: {
      type: Number,
      default: 0,
    },
    avatarUrl: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook: Hash password with bcrypt before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Instance method to compare password
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Transform to remove sensitive password field from responses
UserSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export const User = mongoose.model('User', UserSchema);
export default User;
