import React from 'react'
import { Button, Form, Input, Modal, Radio } from 'antd';
import constant from '../../utils/constant';

export default function FormItem({ formField }) {
    const {
        dataFieldName: name,
        formFieldName: label,
        formFieldType: type,
    } = formField

    const res = () => {
        switch (type) {
            case constant.TEXT:
                return <TextFormItem name={name} label={label} />
            case constant.TEXTAREA:
                return <TextAreaFormItem name={name} label={label} />
            default:
                return "Error: unknown form field type"
        }
    }

    return res
}
const TextFormItem = ({ name, label }) => {
    return (
        <Form.Item
            name={name}
            label={label}
        >
            <Input />
        </Form.Item>
    )
}
const TextAreaFormItem = ({ name, label }) => {
    return (
        <Form.Item
            name={name}
            label={label}
        >
            <Input.TextArea />
        </Form.Item>
    )
}