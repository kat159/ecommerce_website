// @ts-ignore
/* eslint-disable */
import {async} from '@firebase/util';
import {request} from '@umijs/max';
import {getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject, uploadString} from "firebase/storage";
import constant from "@/utils/constant";

const imageMeta = {
  contentType: 'image/jpeg', // file type will be validated in form/Uploader
}

const referencePath = {
  brandLogo: 'brand-logo',
  categoryIcon: 'category-icon',
  productImage: 'product-image',
  skuImage: 'sku-image',
  image: 'image',
}

export default {
  async addImage(file, refPath = referencePath.image, metadata = imageMeta, fileType = constant.BASE64) {
    return _addFile(file, refPath, metadata, fileType);
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
  async deleteAllFile(urls) {
    if (!urls || urls.length === 0) {
      return Promise.resolve();
    }
    const storage = getStorage();
    const deleteTasks = [];
    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      const logoRef = ref(storage, url);
      deleteTasks.push(deleteObject(logoRef).catch(e => {

      }));
    }
    return Promise.all(deleteTasks);
  },
  async deleteFile(url) {
    const storage = getStorage();
    const logoRef = ref(storage, url);
    return deleteObject(logoRef).catch(e => {

    });
  },
  async addAllProductImages(files, fileType = constant.BASE64) {
    return _addAllFiles(files, referencePath.productImage, imageMeta, fileType);
  },
  async addAllSkuImages(files, fileType = constant.BASE64) {
    return _addAllFiles(files, referencePath.skuImage, imageMeta, fileType);
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
  },
}

const b64toBlob = (b64Data, contentType = '', sliceSize = 512) => {

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

async function _addAllFiles(files, referencePath, metadata, fileType = constant.BASE64) {
  if (!files || files.length === 0) {
    return []
  }
  const storage = getStorage();
  const uploadTasks = [];
  const refs = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const fileName = `${new Date().getTime()}_${file.name}`;
    const logoRef = ref(storage, `${referencePath}/${fileName}`);
    refs.push(logoRef);
    const uploadTask =
      fileType === constant.BASE64
        ? uploadString(logoRef, file, 'data_url') // base64 url
        : uploadBytesResumable(logoRef, file, metadata);  // BLOB
    uploadTasks.push(uploadTask);
  }
  await Promise.all(uploadTasks);
  const downloadURLs = [];
  for (let i = 0; i < refs.length; i++) {
    const downloadURL = await getDownloadURL(refs[i]);
    downloadURLs.push(downloadURL);
  }
  return downloadURLs;
}

async function _addFile(file, referencePath, metadata, fileType = constant.BASE64) {

  // Create a root reference
  const storage = getStorage();

  // generate a unique file name, with datetime and file name
  const fileName = `${new Date().getTime()}_${file.name}`;
  const logoRef = ref(storage, `${referencePath}/${fileName}`);

  // Upload the file and metadata

  let uploadTask;
  if (fileType === constant.BASE64) {
    uploadTask = uploadString(logoRef, file, 'data_url'); // base64 url
  } else {
    uploadTask = uploadBytesResumable(logoRef, file, metadata);  // BLOB
  }

  const snapshot = await uploadTask;

  const downloadURL = await getDownloadURL(snapshot.ref);  // the same as logoRef declared above

  return downloadURL;
}

async function addFile(file, referencePath, metadata) {

  // Create a root reference
  const storage = getStorage();

  // generate a unique file name, with datetime and file name
  const fileName = `${new Date().getTime()}_${file.name}`;
  const logoRef = ref(storage, `${referencePath}/${fileName}`);

  // Upload the file and metadata
  // const uploadTask = uploadBytesResumable(logoRef, file, metadata); // blob
  const uploadTask =
    fileType === uploadBytesResumable(logoRef, file, metadata)

  const snapshot = await uploadTask;

  const downloadURL = await getDownloadURL(snapshot.ref);  // the same as logoRef declared above

  return downloadURL;
}




