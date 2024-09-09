import { Model, Types } from 'mongoose';

export type TGuardian = {
  fatherName: string;
  fatherOccupation: string;
  fatherContactNo: string;
  motherName: string;
  motherOccupation: string;
  motherContactNo: string;
};

export type TName = {
  firstName: string;
  middleName?: string;
  lastName: string;
};

export type TLocalGuardian = {
  name: string;
  occupation: string;
  contactNo: string;
  address: string;
};

export type TStudent = {
  id: string;
  user: Types.ObjectId;
  password: string;
  name: TName;
  gender: 'male' | 'female' | 'other';
  dateOfBirth?: string;
  email: string;
  contactNumber: string;
  emergencyContactNo: string;
  bloodGroup?: 'A+' | 'B+' | 'AB+' | 'AB-' | 'O+';
  presentAddress: string;
  permanentAddress?: string;
  guardian: TGuardian;
  localGuardian: TLocalGuardian;
  profileImg?: string;
  admissionSemester: Types.ObjectId;
  academicDepartment: Types.ObjectId;
  academicFaculty: Types.ObjectId;
  isDeleted: boolean;
};

//for creating static method
export interface StudentTStaticModel extends Model<TStudent> {
  // eslint-disable-next-line no-unused-vars
  isUserExits(id: string): Promise<TStudent | null>;
}

// // Put all user instance methods in this type:
// export type StudentMethods = {
//   // eslint-disable-next-line no-unused-vars
//   isUserExits(id: string): Promise<TStudent | null>;
//   //isUserExits StudentMethods object er ekta property and eta promise er moddhe Tstudent return kore.
// };

// // Create a new Model type that knows about StudentMethods...
// export type StudentType = Model<
//   TStudent,
//   Record<string, never>,
//   StudentMethods
// >;
