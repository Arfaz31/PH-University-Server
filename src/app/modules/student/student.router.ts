import express from 'express';
import { StudentController } from './student.controller';
import validateRequest from '../../middleware/validateRequest';
import { updateStudentValidationSchema } from './student.zod.validation';

const router = express.Router();
router.get('/', StudentController.getAllStudent);
router.get('/:id', StudentController.getSingleStudent);
router.patch(
  '/:id',
  validateRequest(updateStudentValidationSchema),
  StudentController.updateStudent,
);
router.delete('/:id', StudentController.deleteStudent);

export const StudentRoutes = router;

//router nijei ekta object tai curly bracket deoar dorkar nai.
