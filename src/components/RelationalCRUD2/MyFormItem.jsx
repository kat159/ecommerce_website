import React from 'react'
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import { Checkbox, Form, Input, InputNumber, message, Switch, Upload } from 'antd';
import { useState } from 'react';
import constant from '../../utils/constant';
import { useMemo } from 'react';
import { useEffect } from 'react';
import MyCRUDDataDisplayerHandler from './MyCRUDDataDisplayerHandler';
import { MinusCircleOutlined, } from "@ant-design/icons";
import { Divider, Button, Select, } from "antd";
import MySpace from '../Layout/MySpace';



/** Input */
const _multiple = ({ label, name, rules = [] }) => (
    <Form.List
        rules={[
            {
                validator: async (_, values) => {
                    if (!values || values.length < 1) {
                        return Promise.reject(new Error('Must have at least one item'));
                    }
                },
            },
        ]}
    >
        {(fields, { add, remove }, { errors }) => {
            return <>
                {fields.map((field, index) => (
                    <Form.Item
                        label={index !== 0 ? '' : <MySpace>
                            {label}
                            <PlusOutlined onClick={() => add()} />
                        </MySpace>

                        }
                        required={true}
                        key={field.key}
                    >
                        <Form.Item
                            {...field}
                            validateTrigger={['onChange', 'onBlur']}
                            rules={[
                                {
                                    required: true,
                                    whitespace: true,
                                    message: "Cannot be empty",
                                },
                            ]}
                            noStyle
                        >
                            <Input
                                style={{
                                    width: '60%',
                                }}
                            />
                        </Form.Item>
                        {fields.length > 1 ? (
                            <MinusCircleOutlined
                                className="dynamic-delete-button"
                                onClick={() => remove(field.name)}
                            />
                        ) : null}
                    </Form.Item>
                ))}
                {/* <Form.Item>
                    <Form.ErrorList errors={errors} />
                </Form.Item> */}
            </>
        }}
    </Form.List>
)
const Text = ({ label, name, rules = [], }) => (
    <Form.Item {...{ label, name, rules, }}
    >
        <Input />
    </Form.Item>
)
const TextArea = ({ label, name, rules = [], }) => (
    <Form.Item {...{ label, name, rules, }}>
        <Input.TextArea />
    </Form.Item>
)
const Integer = ({ label, name, rules, }) => (
    <Form.Item {...{ label, name, }}
        rules={[
            {
                pattern: /^-?\d+$/,
                required: true,
                validator: (rule, value) => {
                    if (value === undefined || value === null || value === '') {
                        return Promise.resolve();
                    }
                    if (value > 2147483647 || value < -2147483648) {
                        return Promise.reject('Value is out of range');
                    }
                    return Promise.resolve();
                },
                message: 'Must be an integer',
            },
            ...rules,
        ]}
    >
        <Input
        />
    </Form.Item>
)
const Number = ({ label, name, rules = [], }) => (
    <Form.Item {...{ label, name, }}
        rules={[
            {
                pattern: /^-?\d+(\.\d+)?$/,
                required: true,
                validator: (rule, value) => {
                    if (value === undefined || value === null || value === '') {
                        return Promise.resolve();
                    }
                    if (value > 2147483647 || value < -2147483648) {
                        return Promise.reject('Value is out of range');
                    }
                    return Promise.resolve();
                },
                message: 'Must be a number',
            },
            ...rules,
        ]}
    >
        <InputNumber
        />
    </Form.Item>
)
const PositiveInteger = ({ label, name, rules = [], }) => {
    return <Form.Item {...{ label, name, }}
        rules={[
            {
                // must be positive integer, not overflow, no leading zero
                pattern: /^[1-9]\d*$/,
                message: 'Must be a positive integer',
            },
            {
                validator: (rule, valueStr) => {
                    if (valueStr === undefined || valueStr === null || valueStr === '') {
                        return Promise.resolve();
                    }
                    // convert value to number
                    let value = Number(valueStr);
                    if (value > 2147483647 || value < 0) {
                        return Promise.reject('Value is out of range');
                    }
                    return Promise.resolve();
                },
                message: 'Must between 1 and 2147483647',
            },
            ...rules,
        ]}>
        <Input />
    </Form.Item>
}
const MultiText = ({ label, name, rules = [], }) => {

    return <Form.List {...{ name, rules, }}
        rules={[
            {
                validator: async (_, values) => {
                    if (!values || values.length < 1) {
                        return Promise.reject(new Error('Must have at least one item'));
                    }
                },
            },
        ]}
    >
        {(fields, { add, remove }, { errors }) => {
            return <>
                {fields.map((field, index) => (
                    <Form.Item
                        label={index !== 0 ? '' : <MySpace>
                            {label}
                            <PlusOutlined onClick={() => add()} />
                        </MySpace>

                        }
                        required={true}
                        key={field.key}
                    >
                        <Form.Item
                            {...field}
                            validateTrigger={['onChange', 'onBlur']}
                            rules={[
                                {
                                    required: true,
                                    whitespace: true,
                                    message: "Cannot be empty",
                                },
                            ]}
                            noStyle
                        >
                            <Input
                                style={{
                                    width: '60%',
                                }}
                            />
                        </Form.Item>
                        {fields.length > 1 ? (
                            <MinusCircleOutlined
                                className="dynamic-delete-button"
                                onClick={() => remove(field.name)}
                            />
                        ) : null}
                    </Form.Item>
                ))}
                {/* <Form.Item>
                    <Form.ErrorList errors={errors} />
                </Form.Item> */}
            </>
        }}
    </Form.List>
}

/** File */
const Image = ({ label, name, rules, form, maxSize }) => (
    <Form.Item {...{ label, name, rules, }}>
        <_MyImageUploader {...{ form, name, maxSize }} />
    </Form.Item>
)
const _MyImageUploader = ({
    form,
    name,
    maxSize = 1024 * 1024 * 2,
    imageProps = {
        alt: "avatar",
        style: {
            width: '100%',
        }
    },
}) => {

    const [loading, setLoading] = useState(false);

    const getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    };

    const beforeUpload = (file) => {  // file is File type
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        } else if (file.size > maxSize) {
            const mb = (maxSize / 1024 / 1024).toFixed(1);
            message.error(`Image must smaller than ${mb}MB!`);
        } else {
            setLoading(true);
            getBase64(file, (url) => {
                setLoading(false);
                form.setFieldValue(name, url)
            });
        }
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
                    {...imageProps}
                />
            ) : (
                uploadButton
            )}
        </Upload>
    );
};

/** Selector */
const Toggle = ({ label, name, rules = [],
    reRender, checkedValue = 1, unCheckedValue = 0,
}) => {
    return <Form.Item {...{ label, name, rules }}
        valuePropName="checked"
        normalize={(value) => { // NOTE: normalize会触发reRender
            reRender && reRender();
            return value ? checkedValue : unCheckedValue;
        }}
    >
        <Switch checked
        />
    </Form.Item>
}
const CheckBox = ({ label, name, rules = [],
    options = {},
}) => {
    return <Form.Item {...{ label, name, rules }}
    >
        <Checkbox.Group>
            {
                Object.entries(options).map((option, index) => {
                    return <Checkbox key={index} value={option[1]}>
                        {option[0]}
                    </Checkbox>
                })
            }
        </Checkbox.Group>
    </Form.Item>
}


export default {
    Input: {
        Text, TextArea, Number, PositiveInteger, Integer, MultiText
    },
    Upload: {
        Image,
    },
    Select: {
        Toggle, CheckBox
    },
    getInputProps: ({
        dataFieldName,
        label,
        formItemRender,
    }) => {
        return { dataFieldName, label, formItemRender }
    },
    getUploadProps: ({
        dataFieldName,
        label,
        formItemRender,
        addFile,
        deleteFile,
        dataRender = apiValue => apiValue, // for table
    }) => {
        return { dataFieldName, label, formItemRender, addFile, deleteFile }
    },
    getSelectProps: ({
        dataFieldName,
        label,
        formItemRender,
        triggerRender = false,
        initialValue = [],
        reverseNormalize = apiValue => apiValue,
        normalize = formItemValue => formItemValue,
        dataRender = apiValue => apiValue, // for table
    }) => {
        return { dataFieldName, label, formItemRender }
    },
    getDisplayerProps: ({
        label,
        displayerProps,
        isRelationalData = true,
        shouldDisplay = record => true,
        dataRender = apiValue => apiValue, // for table
    }) => {
        return { label, displayerProps, isRelationalData }
    }
}