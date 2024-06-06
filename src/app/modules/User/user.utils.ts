// year semesterCode 4digit number

import { TAcademicSemister } from '../academicSemister/academicSemister.interface';
import { User } from './user.model';

const findLastStudentId = async () => {
  const lastStudent = await User.findOne(
    {
      role: 'student',
    },
    {
      id: 1, // fill filtering kora hoise ekhane,
      _id: 0, // id:1 means eta lagbe, object _id lagbe na tai zero.
    },
  )
    .sort({
      createdAt: -1,
    })
    .lean();

  return lastStudent?.id ? lastStudent.id : undefined; // sent full last id 2030010001, so that we can compare between last & current id.
};

export const generateStudentId = async (payload: TAcademicSemister) => {
  // first time 0000
  //0001  => 1
  let currentId = (0).toString(); //0000 by default
  const lastStudentId = await findLastStudentId();

  const lastStudentSemesterCode = lastStudentId?.substring(4, 6);
  const lastStudentYear = lastStudentId?.substring(0, 4);
  const currentSemesterCode = payload.code;
  const currentYear = payload.year;
  if (
    lastStudentId &&
    lastStudentSemesterCode === currentSemesterCode &&
    lastStudentYear === currentYear
  ) {
    currentId = lastStudentId.substring(6); //jodi same year/same semister code mile jai tahole abar substring kore ager 6 digit bad diye last four digit(intial digit 0000) er sathe 1 add hobe.
  }

  let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');

  incrementId = `${payload.year}${payload.code}${incrementId}`;

  return incrementId;
};

// Faculty ID
export const findLastFacultyId = async () => {
  const lastFaculty = await User.findOne(
    {
      role: 'faculty',
    },
    {
      id: 1,
      _id: 0,
    },
  )
    .sort({
      createdAt: -1,
    })
    .lean();

  return lastFaculty?.id ? lastFaculty.id.substring(2) : undefined;
};

export const generateFacultyId = async () => {
  const currentId = (await findLastFacultyId()) || (0).toString();

  // if (lastFacultyId) {
  //   currentId = lastFacultyId.substring(2);
  // }

  let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');

  incrementId = `F-${incrementId}`;

  return incrementId;
};

//Admin
export const findLastAdminId = async () => {
  const lastAdmin = await User.findOne(
    {
      role: 'admin',
    },
    {
      id: 1,
      _id: 0,
    },
  )
    .sort({
      createdAt: -1,
    })
    .lean();

  return lastAdmin?.id ? lastAdmin.id.substring(2) : undefined;
};

export const generateAdminId = async () => {
  const currentId = (await findLastAdminId()) || (0).toString();

  // if (lastAdminId) {
  //   currentId = lastAdminId.substring(2); // 2 no. index theke last index. 0,1 index bad.substraction kora hoise.
  // }
  let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');
  incrementId = `A-${incrementId}`;
  return incrementId;
};
