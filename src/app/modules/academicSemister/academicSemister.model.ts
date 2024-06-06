import { Schema, model } from 'mongoose';
import { TAcademicSemister } from './academicSemister.interface';
import {
  AcademicSemisterCode,
  AcademicSemisterName,
  Months,
} from './academicSemister.constant';

const academicSemisterSchema = new Schema<TAcademicSemister>(
  {
    name: {
      type: String,
      enum: AcademicSemisterName,
      required: true,
    },
    code: {
      type: String,
      enum: AcademicSemisterCode,
      required: true,
    },
    year: {
      type: String,
      required: true,
    },
    startMonth: {
      type: String,
      enum: Months,
      required: true,
    },
    endMonth: {
      type: String,
      enum: Months,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

academicSemisterSchema.pre('save', async function (next) {
  const isSemisterExists = await AcademicSemister.findOne({
    year: this.year,
    name: this.name,
  });
  if (isSemisterExists) {
    throw new Error('Semister is already exists');
  }
  next();
});

export const AcademicSemister = model<TAcademicSemister>(
  'AcademicSemister',
  academicSemisterSchema,
);
