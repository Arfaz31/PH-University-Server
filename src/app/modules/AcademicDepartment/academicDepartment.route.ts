import express from 'express';
import validateRequest from '../../middleware/validateRequest';
import { academicDepartmentValidatonS } from './academicDepartment.validation';
import { academicDepartmentControllers } from './academicDepartment.controller';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../User/user.constant';

const router = express.Router();

router.post(
  '/create-academic-department',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(
    academicDepartmentValidatonS.createAcademicDepartmentValidatonSchema,
  ),
  academicDepartmentControllers.createAcademicDepartment,
);

router.get(
  '/',
  auth(
    USER_ROLE.superAdmin,
    USER_ROLE.admin,
    USER_ROLE.student,
    USER_ROLE.faculty,
  ),
  academicDepartmentControllers.getAllAcademicDepartments,
);
router.get(
  '/:departmentId',
  auth(
    USER_ROLE.superAdmin,
    USER_ROLE.admin,
    USER_ROLE.student,
    USER_ROLE.faculty,
  ),
  academicDepartmentControllers.getSingleAcademicDepartment,
);
router.patch(
  '/:departmentId',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(
    academicDepartmentValidatonS.updateAcademicDepartmentValidatonSchema,
  ),
  academicDepartmentControllers.updateAcademicDepartment,
);

export const academicDepartmentRoutes = router;
