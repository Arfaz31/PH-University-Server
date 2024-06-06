import express from 'express';
import validateRequest from '../../middleware/validateRequest';
import { academicDepartmentValidatonS } from './academicDepartment.validation';
import { academicDepartmentControllers } from './academicDepartment.controller';

const router = express.Router();

router.post(
  '/create-academic-department',
  validateRequest(
    academicDepartmentValidatonS.createAcademicDepartmentValidatonSchema,
  ),
  academicDepartmentControllers.createAcademicDepartment,
);

router.get('/', academicDepartmentControllers.getAllAcademicDepartments);
router.get(
  '/:departmentId',
  academicDepartmentControllers.getSingleAcademicDepartment,
);
router.patch(
  '/:departmentId',
  validateRequest(
    academicDepartmentValidatonS.updateAcademicDepartmentValidatonSchema,
  ),
  academicDepartmentControllers.updateAcademicDepartment,
);

export const academicDepartmentRoutes = router;
