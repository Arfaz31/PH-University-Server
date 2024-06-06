import { Schema, model } from 'mongoose';
import { Tuser } from './user.interface';
import bcrypt from 'bcrypt';
import config from '../../config';

const userSchema = new Schema<Tuser>(
  {
    id: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    needsPasswordChange: { type: Boolean, default: true },
    role: {
      type: String,
      enum: {
        values: ['admin', 'student', 'faculty'],
        message: '{VALUE} is not valid',
      },
      required: true,
    },
    status: {
      type: String,
      enum: ['in-progress', 'blocked'],
      default: 'in-progress',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre('save', async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this;
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds),
  );
  next();
});

//set empty string after saving the pass
userSchema.post('save', function (doc, next) {
  doc.password = '';
  next();
});

export const User = model<Tuser>('User', userSchema);
