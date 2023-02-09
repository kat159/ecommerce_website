import React from 'react'
import { Button, Form, Input, Modal, Radio } from 'antd';
import constant from '../../utils/constant';
import { useMemo } from 'react';
import MyDataEntryHandler from './MyDataEntryHandler';
import { useEffect } from 'react';


const { POP_FORM } = constant
const typeMapper = {
    [POP_FORM]: MyPopForm,
}

export default function MyCRUDFormHandler({
    status,
    onSubmit,
    type = POP_FORM,
    editableFields, 
    editingNode,
    ...props
}) {
    const { title, crudManager, } = props
    const [form] = Form.useForm();

    useEffect(() => {
        if (status === constant.INSERT) { // init all form fields to empty 
            editableFields.forEach(field => {
                if (!field.isRelationalData) {
                    if (editingNode)
                        editingNode[field.dataFieldName] = undefined
                }
            })
        }
        form.setFieldsValue(editingNode)
    }, [editingNode])

    const onFormSubmit = async () => {
        const values = await form.validateFields()

        const returnValues = {}
        for (const field of editableFields) {
            if (!field.isRelationalData) { // not relational data, return to parent component to save into database
                returnValues[field.dataFieldName] = values[field.dataFieldName]
            } else { // relational data, do nothing

            }

        }
        await onSubmit(values);
        form.resetFields();
    }

    return (
        <div>
            {
                typeMapper[type]({
                    ...props,
                    form: form,
                    onSubmit: onFormSubmit,
                    editableFields,
                    editingNode
                })
            }
        </div>
    )
}

function MyPopForm({
    onSubmit,
    onCancel,
    title,
    editableFields,
    editingNode,
    ...props
}) {
    const { form } = props
    const onModalOk = async () => {
        onSubmit()
    }
    console.log('editableFields', editableFields)
    return (
        <Modal
            open={true}
            title={title}
            okText="Submit"
            cancelText="Cancel"
            onCancel={onCancel}
            onOk={() => {
                onModalOk()
            }}
        >
            <Form
                form={form}
                layout="vertical"
                name="form_in_modal"
            >
                {
                    editableFields.map((field, index) => {
                        return <MyDataEntryHandler
                            editableField={field}
                            editingNode={editingNode}
                            key={index}
                            form={form}
                            crudManager={props.crudManager}
                        />
                    })
                }
                {/* <MyDataEntry /> */}
            </Form>
        </Modal >
    )
}