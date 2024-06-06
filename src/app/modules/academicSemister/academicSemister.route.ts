import express from 'express';
import { academicSemisterControllers } from './academicSemister.controller';
import validateRequest from '../../middleware/validateRequest';
import { academicSemisterValidationS } from './academicSemister.validation';

const router = express.Router();

router.post(
  '/create-academic-semister',
  validateRequest(
    academicSemisterValidationS.createAcademicSemisterValidationSchema,
  ),
  academicSemisterControllers.createAcademicSemister,
);

router.get(
  '/:semesterId',
  academicSemisterControllers.getSingleAcademicSemester,
);

router.patch(
  '/:semesterId',
  validateRequest(
    academicSemisterValidationS.updateAcademicSemesterValidationSchema,
  ),
  academicSemisterControllers.updateAcademicSemester,
);

router.get('/', academicSemisterControllers.getAllAcademicSemesters);

export const academicSemisterRoutes = router;

//router nijei ekta object tai curly bracket deoar dorkar nai.
