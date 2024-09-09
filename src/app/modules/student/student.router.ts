import express from 'express';
import { StudentController } from './student.controller';
import validateRequest from '../../middleware/validateRequest';
import { updateStudentValidationSchema } from './student.zod.validation';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../User/user.constant';

const router = express.Router();
router.get(
  '/',
  // auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  StudentController.getAllStudent,
);
router.get(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.faculty),
  StudentController.getSingleStudent,
);
router.patch(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(updateStudentValidationSchema),
  StudentController.updateStudent,
);
router.delete(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  StudentController.deleteStudent,
);

export const StudentRoutes = router;

//router nijei ekta object tai curly bracket deoar dorkar nai.
