
import type { Images, ImageObject } from './PropsType';
import LOAD_STATUS from './loadStatus';
import XTools from '../../toolkit/XTools';

function isImageString(image: ImageObject | string): image is string {
  return XTools.isString(image);
}
function isImageObject(image: ImageObject | string): image is ImageObject {
  return XTools.isObject(image);
}

const formatImages = (images: ReadonlyArray<ImageObject | string>): Images => {
  const previewImages: Images = [];
  (images || []).forEach((image: ImageObject | string) => {
    if (isImageString(image)) {
      previewImages.push({
        url: image,
      });
    } else if (isImageObject(image)) {
      previewImages.push({
        url: image.url,
        originUrl: image.originUrl,
        loaded: LOAD_STATUS.before,
      });
    }
  });
  return previewImages;
};

export default formatImages;
