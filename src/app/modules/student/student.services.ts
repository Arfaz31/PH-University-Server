import mongoose from 'mongoose';
import { Student } from './student.model';
import AppError from '../../errors/AppError';
import { User } from '../User/user.model';
import httpStatus from 'http-status';
import { TStudent } from './student.interface';
import QueryBuilder from '../../Builder/QueryBuilder';
import { studentSearchableFields } from './student.constant';

const getAllStudentFromDB = async (query: Record<string, unknown>) => {
  // main qyery spread kore copy kore neoa hoy jate filtering somoy searchAbleFields exclude kora jai. nahole kono data paoa jabena karon searchterm o tokhon exact match korar try korbe but searchterm will be partial match like name=arf and filtering is exact match like email=arfazahamed1@gmail.com
  // const queryObject = { ...query };

  // const studentSearchableFields = ['email', 'name.firstName', 'presentAddress'];
  // let searchTerm = '';
  // if (query?.searchTerm) {
  //   searchTerm = query?.searchTerm as string;
  // }
  // {email: {$regex: searchTerm}} eivabe search hocche ar $or use kora hoise bcz ek property te na pele arekta diye search hobe
  // const searchQuery = Student.find({
  //   $or: studentSearchableFields.map((field) => ({
  //     [field]: { $regex: searchTerm, $options: 'i' },
  //   })),
  // });

  // //Filter
  // const excludeFileds = ['searchTerm', 'sort', 'limit', 'page', 'fields'];
  // excludeFileds.forEach((el) => delete queryObject[el]);
  // const filterQuery = searchQuery
  //   .find(queryObject)
  //   .populate('admissionSemester')
  //   .populate({
  //     path: 'academicDepartment',
  //     populate: {
  //       path: 'academicFaculty',
  //     },
  //   });

  // // SORTING FUNCTIONALITY:
  // let sort = '-createdAt'; // SET DEFAULT VALUE

  // // IF sort  IS GIVEN SET IT
  // if (query.sort) {
  //   sort = query.sort as string;
  // }

  // const sortQuery = filterQuery.sort(sort);

  // // PAGINATION FUNCTIONALITY:
  // let page = 1; // SET DEFAULT VALUE FOR PAGE
  // let limit = 1; // SET DEFAULT VALUE FOR LIMIT
  // let skip = 0; // SET DEFAULT VALUE FOR SKIP

  // // IF limit IS GIVEN SET IT
  // if (query.limit) {
  //   limit = Number(query.limit);
  // }

  // // IF page IS GIVEN SET IT
  // if (query.page) {
  //   page = Number(query.page);
  //   skip = (page - 1) * limit;
  // }

  // const paginateQuery = sortQuery.skip(skip);

  // const limitQuery = paginateQuery.limit(limit);

  // // FIELDS LIMITING FUNCTIONALITY:
  // // HOW OUR FORMAT SHOULD BE FOR PARTIAL MATCH

  // //fields: 'name,email'; // WE ARE ACCEPTING FROM REQUEST
  // // fields: 'name email'; // HOW IT SHOULD BE

  // let fields = '-__v'; // SET DEFAULT VALUE

  // if (query.fields) {
  //   fields = (query.fields as string).split(',').join(' ');
  // }

  // const fieldQuery = await limitQuery.select(fields);

  // return fieldQuery;

  const studentQuery = new QueryBuilder(
    Student.find()
      .populate('admissionSemester')
      .populate('academicDepartment academicFaculty'),
    query,
  )
    .search(studentSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();
  const meta = await studentQuery.countTotal();
  const result = await studentQuery.modelQuery;
  return { meta, result };
};

const getSingleStudentFromDB = async (id: string) => {
  const result = await Student.findById(id)
    .populate('admissionSemester')
    .populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
      },
    });
  return result;
};

const updateStudentIntoDB = async (id: string, payload: Partial<TStudent>) => {
  const { name, guardian, localGuardian, ...remainingStudentData } = payload;

  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingStudentData,
  };

  //By using Record<string, unknown>, you're telling TypeScript that modifiedUpdatedData is an object with string keys and values that can be of any type (unknown).

  /*
    guardain: {
      fatherOccupation:"Teacher"
    }
    guardian.fatherOccupation = Teacher

    name.firstName = 'Mezba'
    name.lastName = 'Abedin'
  */

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value;
    }
  }
  //name && ensures that name is not null or undefined. Object.keys(name).length checks if the name object has any keys (i.e., it is not an empty object).

  // Initialization:
  // The loop starts by getting the array of entries from Object.entries(name).
  // For example, if name = { firstName: 'John', lastName: 'Doe' }, the array of entries will be [ ['firstName', 'John'], ['lastName', 'Doe'] ].

  // Iteration:
  // The for...of loop iterates over each element of this array.
  // On the first iteration:
  // const [key, value] destructures the first entry ['firstName', 'John'] into key = 'firstName' and value = 'John'.
  // modifiedUpdatedData['name.firstName'] = 'John' is executed.

  if (guardian && Object.keys(guardian).length) {
    for (const [key, value] of Object.entries(guardian)) {
      modifiedUpdatedData[`guardian.${key}`] = value;
    }
  }

  if (localGuardian && Object.keys(localGuardian).length) {
    for (const [key, value] of Object.entries(localGuardian)) {
      modifiedUpdatedData[`localGuardian.${key}`] = value;
    }
  }

  const result = await Student.findByIdAndUpdate(id, modifiedUpdatedData, {
    new: true,
    runValidators: true,
  });
  return result;
};

const deleteStudentFromDB = async (id: string) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const deletedStudent = await Student.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true, session },
    );

    if (!deletedStudent) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete student');
    }
    // get user _id from deletedStudent
    const userId = deletedStudent.user;
    const deletedUser = await User.findByIdAndUpdate(
      userId,
      { isDeleted: true },
      { new: true, session },
    );

    if (!deletedUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete user');
    }

    await session.commitTransaction();
    await session.endSession();

    return deletedStudent;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(error);
  }
};

export const StudentServices = {
  getAllStudentFromDB,
  getSingleStudentFromDB,
  updateStudentIntoDB,
  deleteStudentFromDB,
};
