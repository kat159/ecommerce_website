// import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';
// import { message, Upload } from 'antd';
// import { useState } from 'react';
// import { initializeApp } from "firebase/app";
// import { getAuth, signInWithCustomToken } from "firebase/auth";
// import axios from 'axios';
// import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
// import { saveBrandLogo } from '../../services/third-party-service/googleCloudStorage';
// import { useEffect } from 'react';

// const saveImage = async (file) => {
//     return saveBrandLogo(file);
// }
// // have to override customRequest, or it will send loading request to server(action url in Upload), and action is required
// /**  antd Upload component flow:
//  *   1. beforeUpload(file) --> return true/false, if true, go to next step
//      2. onChange(info) --> **注意 info.file是Object不是File类型，
//             最好的方法是**在beforeUpload自定义**自己对file的处理，
//             onChange和curtomRequest什么都不做
//  *   3. customRequest()
//  *   4. onChange(info) **called two times if customRequest execute onSucces()**
//  *      --> listen to info.file.status, which will be updated by
//  *          callback 'onSuccess('ok')' in customedRequest()
// */
// const customRequest = ({ file, onSuccess }) => {

//     // saveImage(file);
//     // setTimeout(() => {
//     //     onSuccess("ok");
//     // }, 0);
// };

// const getBase64 = (img, callback) => {

//     const reader = new FileReader();
//     reader.addEventListener('load', () => callback(reader.result));
//     reader.readAsDataURL(img);
// };



// export default function MyImageUploader(props) {

//     const { form, name } = props;

//     const [loading, setLoading] = useState(false);
//     const [imageUrl, setImageUrl] = useState();

//     useEffect(() => {

//         setImageUrl(form.getFieldValue(name))
//     }, [])

//     const beforeUpload = (file) => {

//         const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
//         if (!isJpgOrPng) {
//             message.error('You can only upload JPG/PNG file!');
//         }
//         const isLt2M = file.size / 1024 / 1024 < 2;
//         if (!isLt2M) {
//             message.error('MyImage must smaller than 2MB!');
//         }
//         setLoading(true);

//         getBase64(file, (url) => {
//             setLoading(false);
//             setImageUrl(url);
//             form.setFieldsValue({
//                 [name]: file,
//             });
//         });
//         return isJpgOrPng && isLt2M;
//     };

//     const handleChange = (info) => {

//     };

//     const uploadButton = (
//         <div>
//             {loading ? <LoadingOutlined /> : <PlusOutlined />}
//             <div
//                 style={{
//                     marginTop: 8,
//                 }}
//             >
//                 Upload
//             </div>
//         </div>
//     );
//     return (
//         <Upload
//             name="avatar"
//             listType="picture-card"
//             className="avatar-uploader"
//             showUploadList={false}
//             action=""
//             beforeUpload={beforeUpload}
//             onChange={handleChange}
//             customRequest={customRequest}
//         >
//             {imageUrl ? (
//                 <img
//                     src={imageUrl}
//                     alt="avatar"
//                     style={{
//                         width: '100%',
//                     }}
//                 />
//             ) : (
//                 uploadButton
//             )}
//         </Upload>
//     );
// };
