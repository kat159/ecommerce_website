import React from 'react'
import { Button, Form, Input, Modal, Radio } from 'antd';
import { useState } from 'react';
import { useEffect } from 'react';
import FormItem from './FormItem';
import constant from '../../utils/constant';
import { useMemo } from 'react';
import { async } from '@firebase/util';


export default function MyCRUDPopForm({
  onSubmit,
  onCancel,
  title,
  editableFields,
  editingNodeId,
  service,
}) {
  const [form] = Form.useForm();

  // Note: 
  // useEffect executed after the render, 
  //   but MyImageUploader needs initialValues before the render 
  //   **thus, use useMemo() instead**
  useMemo(async() => {
    if (editingNodeId) { // editing, intialize the form with the data
      const response = await service.get({id: editingNodeId})
      const data = response.data


      // set the initial values of the form
      const initialValues = {}
      
      for (const field of editableFields) {
        if (field.isRelationalData && field.shouldDisplay(data)) {
          // is relational data, retrieve relational data
          const response = await field.service.getAll({id: editingNodeId})
          initialValues[field.dataFieldName] = response.data
        } else {
          initialValues[field.dataFieldName] = data[field.dataFieldName]
        }
      }

      form.setFieldsValue(initialValues)
    } else { // adding, leave the form empty
      
    }
  }, [editableFields])

  const onModalOk = async () => {
    const values = await form.validateFields()

    const returnValues = {}
    for (const field of editableFields) {
      
      if (field.dataType === constant.FILE) { 
        // if the field is a file, save the file to the cloud storage first
        const name = field.dataFieldName
        const newFile = values[name]
        const originalFile = field.initialValue
        values[name] = await field.saveFile(newFile, originalFile)
      }
      if (!field.isRelationalData) { // not relational data, return to parent component to save into database
        returnValues[field.dataFieldName] = values[field.dataFieldName]
      } else { // relational data, do nothing

      }
    }
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
        {
          editableFields.map((field, index) => {
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
    </Modal>
  )
}
