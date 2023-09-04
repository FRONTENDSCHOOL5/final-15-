import URL from 'Api/URL';
import ImageUploadAPI from 'Api/Upload/ImageUploadAPI';

export const uploadFile = async (e, imageSetter, targetObject, targetSetter) => {
  const file = e.target.files[0];
  const res = await ImageUploadAPI(file);
  const imageUrl = URL + '/' + res.filename;

  imageSetter(imageUrl);

  if (targetObject && targetSetter) {
    const updatedObject = {
      ...targetObject,
      user: {
        ...targetObject.user,
        image: imageUrl,
      },
    };
    targetSetter(updatedObject);
  }
};