

const fileToBase64 = (file) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(file);
}
export default {
  Image: {
    fileToBase64
  }
}
