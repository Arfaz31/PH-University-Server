export const SemesterRegistrationStatus = ['UPCOMING', 'ONGOING', 'ENDED'];

export const RegistrationStatus = {
  UPCOMING: 'UPCOMING',
  ONGOING: 'ONGOING',
  ENDED: 'ENDED',
} as const; // as const means this object is readOnly. you can't rewrite.
