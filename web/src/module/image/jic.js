/**
 * Created by neodooth on 3/5/15.
 */
window.jic = {
  /**
   * Receives an Image Object (can be JPG OR PNG) and returns a new Image Object compressed
   * @param {Image} source_img_obj The source Image Object
   * @param {Integer} quality The output quality of Image Object
   * @return {Image} result_image_obj The compressed Image Object
   */

  compress(source_img_obj, scale) {
    const mime_type = 'image/jpeg';

    const cvs = document.createElement('canvas');
    // naturalWidth鐪熷疄鍥剧墖鐨勫搴�
    cvs.width = source_img_obj.naturalWidth * scale;
    cvs.height = source_img_obj.naturalHeight * scale;

    if (/(iPad|iPhone|iPod)/g.test(navigator.userAgent)) {
      const mpImg = new MegaPixImage(source_img_obj);
      mpImg.render(cvs, { width: cvs.width, height: cvs.height });
    } else cvs.getContext('2d').drawImage(source_img_obj, 0, 0, cvs.width, cvs.height);

    return cvs.toDataURL(mime_type);
  },

  rotate(image, orientation) {
    let rotation = 0;
    switch (orientation) {
      case 3:
        rotation = 180;
        break;
      case 6:
        rotation = 90;
        break;
      case 8:
        rotation = 270;
        break;
    }
    if (rotation == 0) { return image.src; }

    const canvas = document.createElement('canvas');
    if (rotation == 90 || rotation == 270) {
      canvas.width = image.height;
      canvas.height = image.width;
    } else {
      canvas.width = image.width;
      canvas.height = image.height;
    }

    const context = canvas.getContext('2d');
    context.translate(canvas.width / 2, canvas.height / 2); // move the origin of the canvas to this point
    context.rotate(rotation * TO_RADIANS); // rotate the coordination according to the origin
    context.drawImage(image, -(image.width / 2), -(image.height / 2));

    return canvas.toDataURL('image/jpeg');
  },
};
