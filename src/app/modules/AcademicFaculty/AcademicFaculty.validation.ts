import { z } from 'zod';

const createAcademicFacultyValidatonSchema = z.object({
  body: z.object({
    name: z.string({
      invalid_type_error: 'Academic faculty must be string',
    }),
  }),
});

const updateAcademicFacultyValidatonSchema = z.object({
  body: z.object({
    name: z.string({
      invalid_type_error: 'Academic faculty must be string',
    }),
  }),
});

export const academicFacultyValidatonS = {
  createAcademicFacultyValidatonSchema,
  updateAcademicFacultyValidatonSchema,
};
