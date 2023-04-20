import React from 'react'
import { Button, Form, Input, Modal, Radio } from 'antd';
import constant from '../../utils/constant';
import { useMemo } from 'react';
import MyDataEntryHandler from './MyDataEntryHandler';
import { useEffect } from 'react';
import { useState } from 'react';


const { POP_FORM } = constant
const formTypeMapper = {
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
    const [trigger, setTrigger] = useState(false)

    useEffect(() => {
        let initialData = {}
        if (status === constant.INSERT) { // init all form fields to empty
            editableFields.forEach(field => {
                if (!field.isRelationalData) {
                    initialData[field.dataFieldName] = field.initialValue
                }
            })
        } else if (status === constant.EDIT) {
            initialData = {...editingNode}
            editableFields.forEach(field => {

                if (!field.isRelationalData) {
                    if (field.reverseNormalize) {
                        initialData[field.dataFieldName]
                            = field.reverseNormalize(initialData[field.dataFieldName])

                    }
                }
            })
        }

        form.setFieldsValue(initialData)
    }, [])

    const onFormSubmit = async () => {
        const values = await form.validateFields()
        editableFields.forEach(field => {
            if (!field.isRelationalData && field.normalize) {
                values[field.dataFieldName] = field.normalize(values[field.dataFieldName])
            }
        })
        //
        await onSubmit(values);
        form.resetFields();
    }

    const formItems = editableFields.map((field, index) => {
        return <MyDataEntryHandler
            key={index} // 如果这种形式，key放这就行， 如果是函数形式MyDataEntryHandler()，key要在函数里面传给return的最终带<>的组件， 函数形式不算key
            editableField={field}
            editingNode={editingNode}
            form={form}
            crudManager={props.crudManager}
            reRender={() => setTrigger(!trigger)}
        />
    })

    return (
        <div>
            {
                formTypeMapper[type]({
                    ...props,
                    form: form,
                    onSubmit: onFormSubmit,
                    editableFields,
                    editingNode,
                    formItems
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
    formItems,
    ...props
}) {
    const { form } = props
    const onModalOk = async () => {
        onSubmit()
    }

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
                {formItems}
                {
                    // editableFields.map((field, index) => {
                    //     return <MyDataEntryHandler
                    //         editableField={field}
                    //         editingNode={editingNode}
                    //         key={index}
                    //         form={form}
                    //         crudManager={props.crudManager}
                    //     />
                    // })
                }
                {/* <MyDataEntry /> */}
            </Form>
        </Modal >
    )
}
