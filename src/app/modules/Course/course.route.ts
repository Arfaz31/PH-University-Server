import express from 'express';

import { CourseValidations } from './course.validation';
import validateRequest from '../../middleware/validateRequest';
import { coursesController } from './course.controller';

const router = express.Router();

router.post(
  '/create-course',
  validateRequest(CourseValidations.createCourseValidationSchema),
  coursesController.createCourse,
);

router.get('/:id', coursesController.getSingleCourse);

router.get('/', coursesController.getAllCourses);
router.patch(
  '/:id',
  validateRequest(CourseValidations.updateCourseValidationSchema),
  coursesController.updateCourse,
);

router.delete('/:id', coursesController.deleteCourse);

router.put(
  '/:courseId/assign-faculties',
  validateRequest(CourseValidations.facultiesWithCourseValidationSchema),
  coursesController.assignFacultiesWithCourse,
);

router.delete(
  '/:courseId/remove-faculties',
  validateRequest(CourseValidations.facultiesWithCourseValidationSchema),
  coursesController.removeFacultiesFromCourse,
);

export const CourseRoutes = router;
