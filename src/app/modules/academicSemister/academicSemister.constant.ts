import {
  TAcademicSemisterCode,
  TAcademicSemisterName,
  TAcademicSemisterNameCodeMapper,
  TMonth,
} from './academicSemister.interface';

export const Months: TMonth[] = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const AcademicSemisterName: TAcademicSemisterName[] = [
  'Autumn',
  'Summar',
  'Fall',
];
export const AcademicSemisterCode: TAcademicSemisterCode[] = ['01', '02', '03'];

export const academicSemisterNameCodeMapper: TAcademicSemisterNameCodeMapper = {
  Autumn: '01',
  Summar: '02',
  Fall: '03',
};
