import express from 'express';
import validateRequest from '../../middleware/validateRequest';
import { academicFacultyValidatonS } from './AcademicFaculty.validation';
import { academicFacultyControllers } from './AcademicFaculty.controller';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../User/user.constant';

const router = express.Router();

router.post(
  '/create-academic-faculty',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(
    academicFacultyValidatonS.createAcademicFacultyValidatonSchema,
  ),
  academicFacultyControllers.createAcademicFaculty,
);

router.get(
  '/',
  auth(
    USER_ROLE.superAdmin,
    USER_ROLE.admin,
    USER_ROLE.student,
    USER_ROLE.faculty,
  ),
  academicFacultyControllers.getAllAcademicFaculties,
);
router.get(
  '/:facultyId',
  auth(
    USER_ROLE.superAdmin,
    USER_ROLE.admin,
    USER_ROLE.student,
    USER_ROLE.faculty,
  ),
  academicFacultyControllers.getSingleAcademicFaculty,
);
router.patch(
  '/:facultyId',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(
    academicFacultyValidatonS.updateAcademicFacultyValidatonSchema,
  ),
  academicFacultyControllers.updateAcademicFaculty,
);

export const academicFacultyRoutes = router;
