import getFileDetail from './getFileDetail';
import createThumbnail from './createThumbnail';
import { IFileDetail } from '../FileUpload';

/**
 * handle single file and get file info
 *
 * @param file
 * @param quality
 * @param callback
 */
export default function handleFileInfo(
  { file, quality }: { file: File; quality?: number },
  callback: (data: IFileDetail) => void,
): void {
  const { fileSize, fileType, isPic, fileName } = getFileDetail(file);

  const fileDetail: IFileDetail = {
    file,
    fileType,
    fileSize,
    fileName,
    thumbnail: '',
  };

  const callbackFunc = (url: string) => {
    fileDetail.thumbnail = url;

    callback(fileDetail);
  };

  if (isPic) {
    createThumbnail({
      file,
      quality,
      fileType,
    })
      .then((url) => callbackFunc(url))
      .catch((e) => console.error(e));
  } else {
    callback(fileDetail);
  }
}
