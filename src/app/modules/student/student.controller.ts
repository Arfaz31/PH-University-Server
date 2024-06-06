import { StudentServices } from './student.services';
import catchAsync from '../../utills/catchAsync';
import sendResponse from '../../utills/sendResponse';
import httpStatus from 'http-status';

const getAllStudent = catchAsync(async (req, res) => {
  const result = await StudentServices.getAllStudentFromDB(req.query);
  res.status(200).json({
    success: true,
    message: 'students are retrived successfully',
    data: result,
  });
});

const getSingleStudent = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await StudentServices.getSingleStudentFromDB(id);
  res.status(200).json({
    success: true,
    message: 'students are retrived successfully',
    data: result,
  });
});

const updateStudent = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { student } = req.body;
  const result = await StudentServices.updateStudentIntoDB(id, student);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student is updated succesfully',
    data: result,
  });
});

const deleteStudent = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await StudentServices.deleteStudentFromDB(id);
  res.status(200).json({
    success: true,
    message: 'students are deleted successfully',
    data: result,
  });
});

export const StudentController = {
  getAllStudent,
  getSingleStudent,
  deleteStudent,
  updateStudent,
};
