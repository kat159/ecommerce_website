import React, {useState} from "react";
import {Form, Input, Modal, Select as AntdSelect, Upload} from "antd";
import {PlusOutlined, LoadingOutlined} from '@ant-design/icons';
import constant from '../../utils/constant';
import {useMemo} from 'react';
import {useEffect} from 'react';
import MyCRUDDataDisplayerHandler from './MyCRUDDataDisplayerHandler';
import {MinusCircleOutlined,} from "@ant-design/icons";
import MySpace from '../Layout/MySpace';

const AutoSizeText = ({
  key,
  initWidth = 100,
  maxWidth = 300,
  minRows = 1,
  maxRows = 5,
  letterWidth = 7,
  paddingRight = 30,
  resizeWidth = 50,
  onChange: onValueChange = (value) => {
  },
}) => {
  const [inputWidth, setInputWidth] = useState(initWidth);
  const onChange = (e) => {
    let length = e.target.value.length;
    if (length === 0) {
      setInputWidth(initWidth);
    }
    const curTextWidth = paddingRight + length * letterWidth;
    if (curTextWidth > inputWidth * 0.8) {
      setInputWidth(Math.min(curTextWidth + resizeWidth, maxWidth));
    }
    onValueChange(e.target.value)
  };
  return <Input.TextArea
    key={key}
    autoSize={{minRows, maxRows}}
    style={{
      width: inputWidth,
    }}
    onChange={onChange}
  />
}

const Select = ({
  options = [],
  fieldNames = {
    label: 'label',
    value: 'value',
  },
  style = {},
}) => {
  const labelFieldName = fieldNames.label;
  return <AntdSelect
    showSearch
    optionFilterProp="children"
    filterOption={(input, option) => (option?.[labelFieldName] ?? '').includes(input)}
    filterSort={(optionA, optionB) =>
      (optionA?.[labelFieldName] ?? '').toLowerCase().localeCompare((optionB?.[labelFieldName] ?? '').toLowerCase())
    }
    options={options}
    fieldNames={fieldNames}
    style={{
      width: '200px',
      ...style,
    }}
  >
  </AntdSelect>
}


const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
const MultiImage = ({
  initFileList = [],
  maxSize = 1024 * 1024 * 2,
  maxCount = 10,
}) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileList, setFileList] = useState([]);
  const handleCancel = () => setPreviewOpen(false);
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
  };
  const handleChange = ({ fileList: newFileList }) => {
    console.log('handleChange', newFileList)
    setFileList(newFileList);
  }
  const customRequest = ({ file, onSuccess }) => {
    console.log('customRequest', file)
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
  }
  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    console.log('beforeUpload', file)
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size < maxSize;
    if (!isLt2M) {
      message.error(`Image must smaller than ${Math.floor(maxSize / 1024 / 1024)}MB!`)
    }
    return isJpgOrPng && isLt2M;
  }
  const uploadButton = (
    <div>
      <PlusOutlined />
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
        fileList={fileList}
        listType="picture-card"
        onPreview={handlePreview}
        onChange={handleChange}
        customRequest={customRequest}
        beforeUpload={beforeUpload}
      >
        {fileList.length <= maxCount && uploadButton}
        {/*{uploadButton}*/}
        <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
          <img
            alt="example"
            style={{
              width: '100%',
            }}
            src={previewImage}
          />
        </Modal>
      </Upload>
  );
};
export default {
  Input: {
    AutoSizeText
  },
  Select: {
    Select
  },
  Upload: {
    MultiImage,
  }
}
