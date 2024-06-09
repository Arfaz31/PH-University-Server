import mongoose from 'mongoose';
import QueryBuilder from '../../Builder/QueryBuilder';
import { CourseSearchableFields } from './course.constant';
import { TCourse, TCoursefaculty } from './course.interface';
import { Course, CourseFaculty } from './course.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

const createCourseIntoDB = async (payload: TCourse) => {
  const result = await Course.create(payload);
  return result;
};

const getAllCoursesFromDB = async (query: Record<string, unknown>) => {
  const courseQuery = new QueryBuilder(
    Course.find(),
    // .populate('preRequisiteCourses.course'),
    query,
  )
    .search(CourseSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await courseQuery.modelQuery;
  return result;
};

const getSingleCourseFromDB = async (id: string) => {
  const result = await Course.findById(id).populate(
    'preRequisiteCourses.course',
  );
  return result;
};

const updateCourseIntoDB = async (id: string, payload: Partial<TCourse>) => {
  const { preRequisiteCourses, ...courseRemainingData } = payload;
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const updatedBasicCourseInfo = await Course.findByIdAndUpdate(
      id,
      courseRemainingData,
      { new: true, runValidators: true, session },
    );

    if (!updatedBasicCourseInfo) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update course!');
    }

    //check if there is any pre requisite courses to update
    if (preRequisiteCourses && preRequisiteCourses.length > 0) {
      //filter out the deleted fields
      const deletePreRequisites = preRequisiteCourses
        .filter((el) => el.course && el.isDeleted)
        .map((el) => el.course);
      const deletePreRequisiteCourses = await Course.findByIdAndUpdate(
        id,
        {
          $pull: {
            preRequisiteCourses: { course: { $in: deletePreRequisites } },
          }, //deletePreRequisites array er moddhe j id gulo store kora hocche(filter then map kore) tader sathe preRequisiteCourses array er moddhe course filed er object idr sathe $in method use kore match kora hoy. match holei sheta $pull er karone preRequisiteCourses[] theke remove hye jabe.
        },
        { new: true, runValidators: true, session },
      );

      if (!deletePreRequisiteCourses) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update course!');
      }

      //filter out the new course fields
      const newPreRequisites = preRequisiteCourses?.filter(
        (el) => el.course && !el.isDeleted,
      );
      //
      const newPreRequisitesCourses = await Course.findByIdAndUpdate(
        id,
        {
          $addToSet: { preRequisiteCourses: { $each: newPreRequisites } },
        },
        {
          new: true,
          runValidators: true,
          session,
        },
      );

      if (!newPreRequisitesCourses) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update course!');
      }
    }
    await session.commitTransaction();
    await session.endSession();

    const result = await Course.findById(id).populate(
      'preRequisiteCourses.course',
    );
    return result;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update course');
  }
};

const deleteCourseFromDB = async (id: string) => {
  const result = await Course.findByIdAndUpdate(
    id,
    { isDeleted: true },
    {
      new: true,
    },
  );
  return result;
};

const assignFacultiesWithCourseIntoDB = async (
  id: string,
  payload: Partial<TCoursefaculty>,
) => {
  const result = await CourseFaculty.findByIdAndUpdate(
    id,
    {
      course: id,
      $addToSet: { faculties: { $each: payload } },
    },
    {
      upsert: true, // first time faculty na thakle create korbe ar faculty thakle array te add korbe.
      new: true,
    },
  );
  return result;
};

const removeFacultiesFromCourseFromDB = async (
  id: string,
  payload: Partial<TCoursefaculty>,
) => {
  const result = await CourseFaculty.findByIdAndUpdate(
    id,
    {
      $pull: { faculties: { $in: payload } },
    },
    {
      new: true,
    },
  );
  return result;
};

export const CourseServices = {
  createCourseIntoDB,
  getAllCoursesFromDB,
  getSingleCourseFromDB,
  updateCourseIntoDB,
  deleteCourseFromDB,
  assignFacultiesWithCourseIntoDB,
  removeFacultiesFromCourseFromDB,
};
