import mongoose from 'mongoose';
import config from '../../config';
import { AcademicSemister } from '../academicSemister/academicSemister.model';
import { TStudent } from '../student/student.interface';
import { Student } from '../student/student.model';
import { Tuser } from './user.interface';
import { User } from './user.model';
import {
  generateAdminId,
  generateFacultyId,
  generateStudentId,
} from './user.utils';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { Faculty } from '../Faculty/faculty.model';
import { AcademicDepartment } from '../AcademicDepartment/academicDepartment.model';
import { TFaculty } from '../Faculty/faculty.interface';
import { TAdmin } from '../Admin/admin.interface';
import { Admin } from '../Admin/admin.model';

const createStudentInDB = async (password: string, payLoad: TStudent) => {
  // if (await Student.isUserExits(studentData.id)) {
  //   throw new Error('User already exists!');
  // }
  //create a user object
  const userData: Partial<Tuser> = {};
  //Given a type T, Partial<T> creates a new type where each property of T is optional.

  //if pass not given, use default pass
  userData.password = password || (config.default_pass as string);

  //set student role
  userData.role = 'student';

  // find academic semester info
  const admissionSemester = await AcademicSemister.findById(
    payLoad.admissionSemester,
  );

  if (!admissionSemester) {
    throw new Error('Admission semester not found');
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    //set  generated id
    userData.id = await generateStudentId(admissionSemester);

    //create a user (transaction-1)
    const newUser = await User.create([userData], { session }); //Array data

    //create a student
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user');
    }

    //set id, _id as user
    payLoad.id = newUser[0].id; //[usaerData] holo ekta array tai er zero index a newUser thakbe tai ekhane newUser[0].id;
    payLoad.user = newUser[0]._id; //reference id

    // (transaction-2)
    const newStudent = await Student.create([payLoad], { session });
    if (!newStudent.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create newStudent');
    }

    await session.commitTransaction();
    await session.endSession();

    return newStudent;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(error);
  }
};

const createFacultyIntoDB = async (password: string, payload: TFaculty) => {
  // create a user object
  const userData: Partial<Tuser> = {};

  //if password is not given , use deafult password
  userData.password = password || (config.default_pass as string);

  //set student role
  userData.role = 'faculty';

  // find academic department info
  const academicDepartment = await AcademicDepartment.findById(
    payload.academicDepartment,
  );

  if (!academicDepartment) {
    throw new AppError(400, 'Academic department not found');
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    //set  generated id
    userData.id = await generateFacultyId();

    // create a user (transaction-1)
    const newUser = await User.create([userData], { session }); // array

    //create a faculty
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user');
    }
    // set id , _id as user
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id; //reference _id

    // create a faculty (transaction-2)

    const newFaculty = await Faculty.create([payload], { session });

    if (!newFaculty.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create faculty');
    }

    await session.commitTransaction();
    await session.endSession();

    return newFaculty;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

const createAdminIntoDB = async (password: string, payload: TAdmin) => {
  const userData: Partial<Tuser> = {};
  userData.password = password || (config.default_pass as string);
  userData.role = 'admin';

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    userData.id = await generateAdminId();
    const newUser = await User.create([userData], { session });
    if (!newUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create admin');
    }

    payload.id = newUser[0].id; //generated id
    payload.user = newUser[0]._id; // newuser create houuar por object id ta user hisebe boshbe admin datar moddhe and user er data k refer korbe

    const newAdmin = await Admin.create([payload], { session });
    if (!newAdmin.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create admin');
    }

    await session.commitTransaction();
    await session.endSession();

    return newAdmin;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

export const userServices = {
  createStudentInDB,
  createFacultyIntoDB,
  createAdminIntoDB,
};
