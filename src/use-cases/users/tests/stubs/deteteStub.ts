import { DeleteResult } from 'typeorm';

export const deleteStubFalse = (): DeleteResult => {
  return {
    raw: {
      acknowledged: true,
      deletedCount: 0,
    },
    affected: 0,
  };
};

export const deleteStubTrue = (): DeleteResult => {
  return {
    raw: {
      acknowledged: true,
      deletedCount: 1,
    },
    affected: 0,
  };
};
