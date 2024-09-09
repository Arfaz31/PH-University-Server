import express from 'express';
import { academicSemisterControllers } from './academicSemister.controller';
import validateRequest from '../../middleware/validateRequest';
import { academicSemisterValidationS } from './academicSemister.validation';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../User/user.constant';

const router = express.Router();

router.post(
  '/create-academic-semister',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(
    academicSemisterValidationS.createAcademicSemisterValidationSchema,
  ),
  academicSemisterControllers.createAcademicSemister,
);

router.get(
  '/:semesterId',
  auth(
    USER_ROLE.admin,
    USER_ROLE.superAdmin,
    USER_ROLE.student,
    USER_ROLE.faculty,
  ),
  academicSemisterControllers.getSingleAcademicSemester,
);

router.patch(
  '/:semesterId',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(
    academicSemisterValidationS.updateAcademicSemesterValidationSchema,
  ),
  academicSemisterControllers.updateAcademicSemester,
);

router.get(
  '/',
  auth(
    USER_ROLE.admin,
    USER_ROLE.superAdmin,
    USER_ROLE.student,
    USER_ROLE.faculty,
  ),
  academicSemisterControllers.getAllAcademicSemesters,
);

export const academicSemisterRoutes = router;

//router nijei ekta object tai curly bracket deoar dorkar nai.
