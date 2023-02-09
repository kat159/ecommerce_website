import React from 'react'
import { Button, Form, Input, Modal, Radio, Space } from 'antd';
import { useState } from 'react';
import { useEffect } from 'react';
import FormItem from './FormItem';
import constant from '../../utils/constant';
import { async } from '@firebase/util';
import { useMemo } from 'react';

export default function MyCRUDForm({
    onSubmit,
    onCancel,
    title,
    formFields,
    service,
    editingNodeId,
    
}) {
    const [form] = Form.useForm();
    useMemo(() => {
        const initialValues = {}

        formFields.forEach((field) => {
            initialValues[field.dataFieldName] = field.initialValue
        })
        form.setFieldsValue(initialValues)
    }, [formFields])

    const onModalOk = async () => {
        const values = await form.validateFields()


        for (const field of formFields) {
            // relational fields or file fields must be handled in form before returning the values to the parent component
            if (field.dataType === constant.FILE) {
                // if the field is a file, save the file to the cloud storage first
                const name = field.dataFieldName
                const newFile = values[name]
                const originalFile = field.initialValue
                values[name] = await field.updateFile(newFile, originalFile)
            } else if (field.isRelationData) {  // a foreign relational data must not have dataType, the data should be retrived from the form
                const name = field.dataFieldName
                
            }
        }
        await onSubmit(values);
        form.resetFields();
    }

    return (
        <>
            <h1>{title}</h1>
            <Form
                form={form}
                layout="vertical"
                name="form_in_modal"
            >
                {
                    formFields.map((field, index) => {
                        const {
                            dataFieldName: name,  // name of the field in the data
                            formFieldName: label, // label displayed in the form
                            dataEntryRender,  // data entry component generating function
                            // formFieldType: type,  // type of the data entry(eg. text, textarea, radio, checkbox, etc.)
                        } = field

                        return <Form.Item
                            key={index}
                            name={name}
                            label={label}
                            rules={[
                                {
                                    required: true,
                                    message: 'Could not be empty',
                                },
                            ]}
                        >
                            {dataEntryRender({ name: name, form: form, })}
                        </Form.Item>
                    })
                }
            </Form>
            <Space>
                <Button onClick={onCancel}>Cancel</Button>
                <Button type="primary" onClick={onModalOk}>Save</Button>
            </Space>
        </>
    )
}
