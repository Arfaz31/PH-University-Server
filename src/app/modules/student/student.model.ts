import { Schema, model } from 'mongoose';
import {
  StudentTStaticModel,
  TGuardian,
  TLocalGuardian,
  TName,
  TStudent,
} from './student.interface';
// import AppError from '../../errors/AppError';
// import httpStatus from 'http-status';

const userNameSchema = new Schema<TName>({
  firstName: {
    type: String,
    required: true,
  },
  middleName: { type: String },
  lastName: { type: String, required: true },
});

const guardianSchema = new Schema<TGuardian>({
  fatherName: {
    type: String,
    required: true,
  },
  fatherOccupation: { type: String, required: true },
  fatherContactNo: { type: String, required: true },
  motherName: {
    type: String,
    required: true,
  },
  motherOccupation: {
    type: String,
    required: true,
  },
  motherContactNo: {
    type: String,
    required: true,
  },
});

const localGuardianSchema = new Schema<TLocalGuardian>({
  name: {
    type: String,
    required: true,
  },
  occupation: {
    type: String,
    required: true,
  },
  contactNo: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
});

const studentSchema = new Schema<TStudent, StudentTStaticModel>(
  {
    id: { type: String, required: true, unique: true },
    user: {
      type: Schema.Types.ObjectId,
      required: [true, 'user is required'],
      unique: true,
      ref: 'userModel',
    },
    name: { type: userNameSchema, required: true },
    gender: {
      type: String,
      enum: {
        values: ['male', 'female', 'other'],
        message: '{VALUE} is not valid',
      },
      required: true,
    },
    dateOfBirth: { type: String },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    contactNumber: { type: String, required: true },
    emergencyContactNo: {
      type: String,
      required: true,
    },
    bloodGroup: { type: String, enum: ['A+', 'B+', 'AB+', 'AB-', 'O+'] },
    presentAddress: { type: String, required: true },
    permanentAddress: { type: String, required: true },
    guardian: { type: guardianSchema, required: true },
    localGuardian: { type: localGuardianSchema, required: true },
    profileImg: { type: String },
    admissionSemester: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicSemister',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },

    academicDepartment: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicDepartment',
    },
  },
  { toJSON: { virtuals: true } },
);
//virtual
studentSchema.virtual('fullName').get(function () {
  return ` ${this?.name?.firstName}  ${this?.name?.middleName} ${this?.name?.lastName}`;
});

//query Middleware
// studentSchema.pre('find', function (next) {
//   this.find({ isDelted: { $ne: true } });

//   next();
// });

// studentSchema.pre('findOne', function (next) {
//   this.find({ isDelted: { $ne: true } });

//   next();
// });

//creating a custom static method

// studentSchema.statics.isUserExits = async function (id: string) {
//   const existingUser = await Student.findOne({ id });
//   return existingUser;
// };

// studentSchema.methods.isUserExits = async function (id: string) {
//   const existingUser = await StudentModel.findOne({ id });
//   return existingUser;
// };

// studentSchema.pre('findOneAndUpdate', async function (next) {
//   const query = this.getQuery();

//   const isStudentExist = await Student.findOne(query);
//   if (!isStudentExist) {
//     throw new AppError(httpStatus.NOT_FOUND, 'This Student does not exist!');
//   }
//   next();
// });

export const Student = model<TStudent, StudentTStaticModel>(
  'Student',
  studentSchema,
);
//model ekta type nei generic hisebe and model er name(Student) and ekta schema(studentSchema) deoa lage.
