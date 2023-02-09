// @ts-ignore
/* eslint-disable */
import { async } from '@firebase/util';
import { request } from '@umijs/max';
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject, uploadString } from "firebase/storage";


const imageMeta = {
  contentType: 'image/jpeg', // file type will be validated in form/Uploader
}

const referencePath = {
  brandLogo: 'brand-logo',
  categoryIcon: 'category-icon',
  image: 'image',
}


export default {
  async addImage(file) {
    return _addFile(file, referencePath.image, imageMeta);
  },
  async addBrandLogo(file) {
    return _addFile(file, referencePath.brandLogo, imageMeta);
  },
  async addCategoryIcon(file) {
    return _addFile(file, referencePath.categoryIcon, imageMeta);
  },
  async saveCategoryIcon(newFile, originalFile) {
    return saveFile(newFile, originalFile, referencePath.categoryIcon, imageMeta);
  },
  async deleteFile(url) {
    const storage = getStorage();
    const logoRef = ref(storage, url);
    return deleteObject(logoRef);
  },
  /** add file to firebase storage(firestore) */
  // add if no original file, delete + add if original file changed, do nothing if no change
  async saveFile(newFile, originalFile, referencePath, metadata) {
  if (originalFile) { // has original file
    if (originalFile === newFile) { // no change
      return originalFile;
    } else { // delete original file
      await deleteFile(originalFile);
      return _addFile(newFile, referencePath, metadata);
    }
  } else { // no original file
    return _addFile(newFile, referencePath, metadata);
  }
}
}

const b64toBlob = (b64Data, contentType='', sliceSize=512) => {

  const byteCharacters = atob(b64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, {type: contentType});
  return blob;
}

async function _addFile(file, referencePath, metadata) {

  // Create a root reference
  const storage = getStorage();

  // generate a unique file name, with datetime and file name
  const fileName = `${new Date().getTime()}_${file.name}`;
  const logoRef = ref(storage, `${referencePath}/${fileName}`);

  // Upload the file and metadata
  // const uploadTask = uploadBytesResumable(logoRef, file, metadata); // blob
  const uploadTask = uploadString(logoRef, file, 'data_url') // base64 url

  const snapshot = await uploadTask;


  const downloadURL = await getDownloadURL(snapshot.ref);  // the same as logoRef declared above

  return downloadURL;
}




