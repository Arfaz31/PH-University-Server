import express from 'express';
import { userController } from './user.controller';
import validateRequest from '../../middleware/validateRequest';
import { CreateStudentValidationSchema } from '../student/student.zod.validation';
import { createFacultyValidationSchema } from '../Faculty/faculty.validation';
import { createAdminValidationSchema } from '../Admin/admin.validation';

const router = express.Router();

router.post(
  '/create-student',
  validateRequest(CreateStudentValidationSchema),
  userController.createStudent,
);

router.post(
  '/create-faculty',
  validateRequest(createFacultyValidationSchema),
  userController.createFaculty,
);
router.post(
  '/create-admin',
  validateRequest(createAdminValidationSchema),
  userController.createAdmin,
);

export const userRouter = router;
