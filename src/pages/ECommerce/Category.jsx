import React from 'react'
import { useEffect, useState } from 'react'
import apiPrefix from '../../../config/apiPrefix'
import axios from 'axios'
import { Tree, Space } from 'antd'
import { DeleteOutlined, EditOutlined, InsertRowRightOutlined, PlusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import DeleteConfirm from '../../components/PopConfirm/DeleteConfirm'
import { Modal, Input, Form, Radio } from 'antd'
import { useRef } from 'react'
import PopForm from './PopForm'
import { update } from 'lodash'
import { visitParameterList } from 'typescript'

const CollectionCreateForm = ({ open, onCreate, onCancel }) => {
  const [form] = Form.useForm();
  return (
    <Modal
      open={open}
      title="Create a new collection"
      okText="Create"
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
          name="title"
          label="Title"
          rules={[
            {
              required: true,
              message: 'Please input the title of collection!',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="description" label="Description">
          <Input type="textarea" />
        </Form.Item>
        <Form.Item name="modifier" className="collection-create-form_last-form-item">
          <Radio.Group>
            <Radio value="public">Public</Radio>
            <Radio value="private">Private</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default function Category() {

  const [data, setData] = useState([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = () => {
  }
  const [formData, setFormData] = useState({
    formType: null,
    title: null,
    visible: false,
    data: {

    }
  })
  const [insertParent, setInsertParent] = useState(null)
  const onInsert = (nodeData) => {
    return (e) => {
      const vo = CategoryService.VO(nodeData)

      e.stopPropagation()
      showModal()
      setFormData({
        formType: 'insert',
        title: 'Insert',
        visible: true,
        data: {
          parantCid: vo.catId,
          catLevel: vo.catLevel + 1
        }
      })

      fetchData()
    }
  }
  const [editNode, setEditNode] = useState(null)
  const onEdit = (nodeData) => {
    return (e) => {
      e.stopPropagation()
      setFormData({
        formType: 'update',
        title: 'Update',
        visible: true,
        data: {
          catId: nodeData.id,
          name: nodeData.name,
          icon: nodeData.icon,
        }
      })

      fetchData()
    }
  }

  const onDelete = (nodeData) => {
    return async (e) => {
      e.stopPropagation()
      await CategoryService.deleteById(nodeData.id)

      fetchData()
    }
  }

  const titleRender = (nodeData) => {
    return (
      nodeData.children.length !== 0
        ? <div>
          <Space>
            <span>{nodeData.title}</span>
            <PlusCircleOutlined className='my-click-icon'
              onClick={onInsert(nodeData)}
            />
          </Space>
        </div>
        : <div>
          <Space>
            <span>{nodeData.title}</span>
            <EditOutlined className='my-click-icon'
              onClick={onEdit(nodeData)}
            />
            <DeleteConfirm onConfirm={onDelete(nodeData)} >
              <DeleteOutlined className='my-click-icon'
              />
            </DeleteConfirm>
          </Space>
        </div>
    )
  }

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = async () => {
    setIsModalOpen(true);
  };
  const handleInsertOk = (data) => {
    setIsModalOpen(false);

    CategoryService.save(
      data.name,
      insertParent.id,
      insertParent.catLevel + 1
    ).then(
      response => {
        fetchData()
        setInsertParent(null)
      }
    )
  };
  const handleUpdateOk = (data) => {
    setIsModalOpen(false);

    CategoryService.update(
      data.name,
      editNode.id,
    ).then(
      response => {
        fetchData()
        setEditNode(null)
      }
    )
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    setInsertParent(null)
    setEditNode(null)
  };

  return (
    // <div>
    //   <Tree
    //     showLine
    //     // switcherIcon={<DownOutlined />}
    //     treeData={data}
    //     titleRender={titleRender}
    //     selectable={false}
    //     expandAction='click'
    //   />
    //   <PopForm open={isModalOpen} 
    //     onCreate={insertParent !== null ? handleInsertOk : handleUpdateOk}
    //     onCancel={handleCancel}
    //   />
    // </div>
    <Form>
      <Form.Item
        label="Name"
        name="name"
        rules={[{ required: true, message: 'Please input your name!' }]}
      >
        <Input />
      </Form.Item>
      <div>
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Please input your name!' }]}
        >
          <Input />
        </Form.Item>
      </div>
    </Form>
  )
}

