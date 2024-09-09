import { Schema, model } from 'mongoose';
import { Tuser, UserModel } from './user.interface';
import bcrypt from 'bcrypt';
import config from '../../config';

const userSchema = new Schema<Tuser, UserModel>(
  {
    id: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: 0 }, //select: 0 korar karone jotoi populate kori password show hobe na
    needsPasswordChange: { type: Boolean, default: true },
    passwordChangedAt: {
      type: Date,
    },
    role: {
      type: String,
      enum: {
        values: ['superAdmin', 'admin', 'student', 'faculty'],
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

// remove password field from json response.
userSchema.methods.toJSON = function () {
  const user = this.toObject(); //this refers to the document instance. toObject() is a Mongoose method that converts the Mongoose document into a plain JavaScript object
  delete user.password;
  return user;
};
//How this work
// When you fetch the user document from the database (e.g., using User.findById), the password field is included in the document retrieved from MongoDB.
// When you convert the document to JSON (e.g., when sending it as a response with res.json(user)), the custom toJSON method is called.
// Inside the toJSON method, the password field is deleted from the plain JavaScript object that represents the document.

userSchema.pre('save', async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this; //'this' refers to the document that is being saved.
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds),
  );
  next(); //next();: This function call signals that the middleware is finished and that Mongoose should proceed with the next operation. Without calling next(), the process would be stuck in this middleware and never proceed.
});

//set empty string after saving the pass
// userSchema.post('save', function (doc, next) {
//   doc.password = ''; //This line sets the password field of the saved document (doc) to an empty string.
//   next();
// });

userSchema.statics.isUserExistsByCustomId = async function (id: string) {
  return await User.findOne({ id }).select('+password'); // default hisebe zero kora tai ekhane plus kore abar add kore find kore data ana hocche. ekhane +password na korle nicher function a ami user theke hashed password access korte parbo na. as a result login korar somoy user.password kore database theke hash pass retrieve kore plaintextpass(client j pass debe) shetar sathe compare kora jabe na.
};

userSchema.statics.isPasswordMatched = async function (
  plainTextPassword,
  hashedPassword, //
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

userSchema.statics.isJWTIssuedBeforePasswordChanged = function (
  passwordChangedTimestamp: Date,
  jwtIssuedTimestamp: number,
) {
  const passwordChangedTime =
    new Date(passwordChangedTimestamp).getTime() / 1000;
  return passwordChangedTime > jwtIssuedTimestamp;
};

export const User = model<Tuser, UserModel>('User', userSchema);
