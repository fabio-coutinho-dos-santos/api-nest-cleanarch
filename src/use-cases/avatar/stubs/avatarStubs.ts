export const avatarStub = () => {
  return {
    userId: 1,
    hash: 'avatarHash',
  };
};

export const deleteAvatarStub = () => {
  return {
    avatarDeleted: true,
    imageDeleted: true,
  };
};

export const imageStub = () => {
  return 'imageString';
};

export const avatarStubReponse = () => {
  return {
    userId: 1,
    avatar: 'imageString',
  };
};
