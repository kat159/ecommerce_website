import { Button, Form, Input, Modal, Radio } from 'antd';
import { useState } from 'react';

const PopForm = ({ open, onCreate, onCancel, title,  }) => {
  const [form] = Form.useForm();
  return (
    <Modal
      open={open}
      title="Create a subcategory"
      okText="Submit"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields();
            onCreate(values);
          })
          .catch((info) => {

          });
      }}
    >
      <Form
        form={form}
        layout="vertical"
        name="form_in_modal"
        initialValues={{
          modifier: 'public',
        }}
      >
        <Form.Item
          name="name"
          label="Name"
          rules={[
            {
              required: true,
              message: 'Please input the name of category!',
            },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default PopForm;