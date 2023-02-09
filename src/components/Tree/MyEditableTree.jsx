import { Tree, Space } from 'antd'
import { DeleteOutlined, EditOutlined, InsertRowRightOutlined, PlusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import DeleteConfirm from '../PopConfirm/DeleteConfirm'
import React from 'react'
import MyCRUDPopForm from '../Form/MyCRUDPopForm'
import { useState } from 'react'
import { useEffect } from 'react'

// Tree with CRUD features
export default function MyEditableTree(props) {
    
    // service -> the service interface that provides the CRUD operations
    const { service } = props

    // titleFieldName -> the field name of the field in the data that will be displayed as the title of the node
    const { childrenFieldName = 'children', idFieldName = 'id', titleFieldName = 'title', parantIdFieldName = 'parentId' } = props

    const { editIcon = <EditOutlined />, deleteIcon = <DeleteOutlined />, insertIcon = <PlusCircleOutlined /> } = props

    const { editableFields } = props

    const [treeData, setData] = useState(null)

    useEffect(() => {
        fetchTreeData()
    }, [])

    const fetchTreeData = () => {
        const convertToTreeData = (data) => {
            return data.map((item) => {
                const children = convertToTreeData(item[childrenFieldName])
                return {
                    ...item,
                    key: item[idFieldName],
                    title: item[titleFieldName],
                    children
                }
            })
        };
        service.forest().then(
            response => {
                const data = response.data
                const treeData = convertToTreeData(data)

                setData(treeData)
            }
        )
    }
    const INSERT = 'insert';
    const EDIT = 'edit';
    const [isEditing, setIsEditing] = useState(false)
    const [editType, setEditType] = useState(null)
    const [editingNode, setEditingNode] = useState(null)
    const [formFields, setFormFields] = useState(null)

    const onInsert = (nodeData) => {
        return (e) => {

            e.stopPropagation()
            setIsEditing(true)
            setEditType(INSERT)
            setEditingNode(nodeData)
        }
    }

    const onEdit = (nodeData) => {
        return (e) => {

            e.stopPropagation()
            setIsEditing(true)
            setEditType(EDIT)
            setEditingNode(nodeData)
        }
    }

    const onDelete = (nodeData) => {
        return (e) => {
            e.stopPropagation()
            service.remove([nodeData[idFieldName]]).then(
                response => {
                    fetchTreeData()
                }
            )

        }
    }

    const titleRender = (nodeData) => {
        return (
            <div>
                <Space>
                    <span>{nodeData.title}</span>
                    <PlusCircleOutlined className='my-click-icon'
                        onClick={onInsert(nodeData)}
                    />
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

    const onFormSubmit = (data) => {

        let promise = null;
        if (editType === 'insert') {
            data[parantIdFieldName] = editingNode[idFieldName] // set the parent id of the new node to the id of the node that triggers the insert
            promise = service.add(data) // Insert the new node
        } else if (editType === 'edit') {
            data[idFieldName] = editingNode[idFieldName] // set the id of the node to be updated
            promise = service.update(data)
        }
        promise.then(
            response => {
                fetchTreeData()
                setIsEditing(false);
            }
        )
    };

    const onFormCancel = () => {
        setIsEditing(false);
    }

    const onDrop = (info) => {

    }

    return (
        <div>
            <Tree
                treeData={treeData}
                showLine
                titleRender={titleRender}
                selectable={false}
                expandAction='click'
                // draggable
                // onDrop={onDrop}
            />
            {isEditing && <MyCRUDPopForm
                editingNodeId={editType=== 'edit' ? editingNode[idFieldName] : null}
                editableFields={editableFields}
                service={service}
                onSubmit={onFormSubmit}
                onCancel={onFormCancel}
                title={editType === 'insert' ? 'Insert' : 'Edit'}
                formFields={formFields}
            />}
        </div>
    )
}
