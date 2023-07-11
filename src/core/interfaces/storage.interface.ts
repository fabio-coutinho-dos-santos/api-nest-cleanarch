export interface IStorageService {
  findFile(path: string);
  uploadFile(file: unknown, hash: string);
  getFileInBase64(userId: number);
  deleteFile(hash: string);
}
