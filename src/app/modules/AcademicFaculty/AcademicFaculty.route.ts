import express from 'express';
import validateRequest from '../../middleware/validateRequest';
import { academicFacultyValidatonS } from './AcademicFaculty.validation';
import { academicFacultyControllers } from './AcademicFaculty.controller';

const router = express.Router();

router.post(
  '/create-academic-faculty',
  validateRequest(
    academicFacultyValidatonS.createAcademicFacultyValidatonSchema,
  ),
  academicFacultyControllers.createAcademicFaculty,
);

router.get('/', academicFacultyControllers.getAllAcademicFaculties);
router.get('/:facultyId', academicFacultyControllers.getSingleAcademicFaculty);
router.patch(
  '/:facultyId',
  validateRequest(
    academicFacultyValidatonS.updateAcademicFacultyValidatonSchema,
  ),
  academicFacultyControllers.updateAcademicFaculty,
);

export const academicFacultyRoutes = router;
