import React from 'react'
import { Button, Form, Input, Modal, Radio } from 'antd';


export function PopForm({
    onSubmit,
    onCancel,
    title,
    form,
    ...props
}) {

    const { children } = props;
    const onModalOk = async () => {
        const values = await form.validateFields()
        await onSubmit(values);
        form.resetFields();
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
                {children}
            </Form>
        </Modal>
    )
}