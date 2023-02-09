// import { Input } from 'antd';
// import React from 'react'
// import MyImageUploader from '../../components/Form/MyImageUploader';
// import MyEditableTable from '../../components/Table/MyEditableTable'
// import productService from '../../services/dbms-product/index'
// import { deleteFile, saveBrandLogo } from '../../services/third-party-service/googleCloudStorage';

// export default function Brand() {
//     const brandService = productService.brandController;
//     const service = {
//         add: brandService.add11,
//         update: brandService.update11,
//         remove: brandService.delete11,
//         page: brandService.page11,
//         get: brandService.get11,
//     }

//     const tableFields = [
//         {
//             dataFieldName: 'name',
//             formFieldName: 'Brand Name',
//             dataRender: (text, record, index) => <>{text}</>,
//             dataEntryRender: (props) => <Input />
//         },
//         {
//             dataFieldName: 'logo',
//             formFieldName: 'Logo',
//             dataRender: (url, record, index) => {
//                 return <img
//                     src={url}
//                     alt="brand-logo"
//                     style={{
//                         maxHeight: 'min(10vh, 40px)', // Note: 10% of the viewport height, like media query in flutter
//                     }}
//                 />
//             },
//             dataEntryRender: props => <MyImageUploader {...props} />,
//             dataType: 'file',
//             saveFile: saveBrandLogo,
//         },
//         {
//             dataFieldName: 'description',
//             formFieldName: 'Description',
//             dataRender: (text, record, index) => <>{text}</>,
//             dataEntryRender: (props) => <Input.TextArea />
//         },
//     ]
//     return (
//         <div>
//             <MyEditableTable
//                 service={service}
//                 tableFields={tableFields}
//             />
//         </div>
//     )
// }
