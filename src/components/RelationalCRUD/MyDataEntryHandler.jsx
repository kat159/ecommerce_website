import React from 'react'
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import { Form, Input, InputNumber, message, Switch, Upload } from 'antd';
import { useState } from 'react';
import constant from '../../utils/constant';
import { useMemo } from 'react';
import { useEffect } from 'react';
import MyCRUDDataDisplayerHandler from './MyCRUDDataDisplayerHandler';
import { MinusCircleOutlined, } from "@ant-design/icons";
import { Divider, Button, Select, } from "antd";
import MySpace from '../Layout/MySpace';

const { LOGO, TEXT, TEXTAREA, ICON, POSTIVE_INTEGER,
    NUMBER, INTEGER, CUSTOM_CONTROLLED_ITEM,
    MULTI_INPUT, SWTICH
} = constant

const normalFormItemMap = {
    [TEXT]: ({ itemProps, entryProps }) => (
        <Form.Item {...itemProps}>
            <Input {...entryProps} />
        </Form.Item>
    ),
    [TEXTAREA]: ({ itemProps, entryProps }) => (
        <Form.Item {...itemProps}>
            <Input.TextArea {...entryProps} />
        </Form.Item>
    ),
    [INTEGER]: ({ itemProps, entryProps }) => (
        <Form.Item {...itemProps}
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
            ]}
        >
            <Input {...entryProps} />
        </Form.Item>
    ),
    [NUMBER]: ({ itemProps, entryProps }) => (
        <Form.Item {...itemProps}
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
            ]}
        >
            <InputNumber {...entryProps}
            />
        </Form.Item>
    ),
    [POSTIVE_INTEGER]: ({ itemProps, entryProps }) => (
        <Form.Item {...itemProps}
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
                ...itemProps.rules,
            ]}
        >
            <Input {...entryProps} />
        </Form.Item>
    ),
    [MULTI_INPUT]: ({ itemProps, entryProps }) => (
        <Form.List {...itemProps}
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
                                {itemProps.label}
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
    ),
    [SWTICH]: ({ itemProps, entryProps }) => (
        <Form.Item {...itemProps}>
            <Switch {...entryProps} />
        </Form.Item>
    ),
}

const fileFormItemMap = {
    [LOGO]: ({ itemProps, entryProps }) => {
        return <Form.Item {...itemProps}>
            <MyImageUploader {...entryProps} />
        </Form.Item>
    },
    // [ICON]: (props) => <MyImageUploader {...props} />,
    [ICON]: ({ itemProps, entryProps }) => {
        return <Form.Item {...itemProps}>
            <MyImageUploader {...entryProps} />
        </Form.Item>
    },
}

const customFormItemMap = {
    [CUSTOM_CONTROLLED_ITEM]: ({ itemProps, entryProps, render }) => {
        return <Form.Item {...itemProps}>
            {render(entryProps)}
        </Form.Item>
    },
}

export default function MyDataEntryHandler({
    editableField,
    form,
    editingNode,
    ...props
}) {
    const {
        type,
        dataFieldName, // field name in the data
        label, // label displayed in the form
        rules = [{
            required: true,
            message: 'Could not be empty',
        }],
        key,
        isRelationalData,
        shouldDisplay,
        displayerProps
    } = editableField
    let result;
    if (isRelationalData) {
        if (!editingNode || !shouldDisplay || shouldDisplay(editingNode)) {
            result = (
                MyCRUDDataDisplayerHandler({
                    ...displayerProps,
                    key: { key },
                    formItemLabel: label,
                    crudManager: props.crudManager,
                    primaryId: editingNode.id
                })
            )
        } else { // not display
        }
    } else if (type) {
        const itemProps = {
            key, label, name: dataFieldName, rules
        }
        if (normalFormItemMap[type]) {
            const entryProps = {}
            result = normalFormItemMap[type]({ itemProps, entryProps })
        } else if (fileFormItemMap[type]) {
            const entryProps = { form, dataFieldName, ...props }
            result = fileFormItemMap[type]({ itemProps, entryProps })
        } else if (customFormItemMap[type]) {
            const entryProps = { dataFieldName, ...props }
            result = customFormItemMap[type]({ itemProps, entryProps, ...props })
        }
    } else {
        console.error('editableField must have type or isRelationalData')
    }

    return result
}

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

function MyImageUploader(props) {

    const { form, dataFieldName } = props;

    const [loading, setLoading] = useState(false);

    const beforeUpload = (file) => {  // file is File type

        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('MyImage must smaller than 2MB!');
        }
        setLoading(true);
        getBase64(file, (url) => {
            setLoading(false);

            form.setFieldValue(dataFieldName, url)

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
            {form.getFieldValue(dataFieldName) ? (
                <img
                    src={form.getFieldValue(dataFieldName)}
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
