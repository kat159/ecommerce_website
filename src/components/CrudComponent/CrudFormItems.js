import React from 'react'
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import { Form, Input, message, Upload } from 'antd';
import { useState } from 'react';
import constant from '../../utils/constant';


// have to override customRequest, or it will send loading request to server(action url in Upload), and action is required
/**  antd Upload component flow:
 *   1. beforeUpload(file) --> return true/false, if true, go to next step
     2. onChange(info) --> **注意 info.file是Object不是File类型， 
            最好的方法是**在beforeUpload自定义**自己对file的处理， 
            onChange和curtomRequest什么都不做
 *   3. customRequest()
 *   4. onChange(info) **called two times if customRequest execute onSucces()**
 *      --> listen to info.file.status, which will be updated by 
 *          callback 'onSuccess('ok')' in customedRequest()
*/

const getBase64 = (img, callback) => {

    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
};

export function ImageUploader({
    form, 
    name,
    ...props
}) {

    const [loading, setLoading] = useState(false);

    const beforeUpload = (file) => {  // file is File type

        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        setLoading(true);
        getBase64(file, (url) => {
            setLoading(false);

            form.setFieldValue(name, url)

        });

        return isJpgOrPng && isLt2M;
    };
    const handleChange = (info) => {  // **info.file is Object not File type**

        const file = info.file.originFileObj

    };

    const uploadButton = (
        <div>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div
                style={{
                    marginTop: 8,
                }}
            >
                Upload
            </div>
        </div>
    );
    return (
        <Upload
            listType="picture-card"
            className="icon-uploader"
            showUploadList={false}
            action=""
            beforeUpload={beforeUpload}
            onChange={handleChange}
        >
            {form.getFieldValue(name) ? (
                <img
                    src={form.getFieldValue(name)}
                    alt="avatar"
                    style={{
                        width: '100%',
                    }}
                />
            ) : (
                uploadButton
            )}
        </Upload>
    );
};