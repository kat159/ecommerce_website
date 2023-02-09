import { Tree, Space } from 'antd'
import { DeleteOutlined, EditOutlined, InsertRowRightOutlined, PlusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import DeleteConfirm from '../PopConfirm/DeleteConfirm'
import React from 'react'
import MyCRUDPopForm from '../Form/MyCRUDPopForm'
import { useState } from 'react'
import { useEffect } from 'react'
import { useMemo } from 'react'

// Tree with CRUD features
export default function CrudTree(props) {

    // service -> the service interface that provides the CRUD operations
    const { service } = props

    // titleFieldName -> the field name of the field in the data that will be displayed as the title of the node
    const { childrenFieldName = 'children', idFieldName = 'id', titleFieldName = 'title', parantIdFieldName = 'parentId' } = props

    const { editIcon = <EditOutlined />, deleteIcon = <DeleteOutlined />, insertIcon = <PlusCircleOutlined /> } = props

    const { editableFields } = props

    const { onInsert, onEdit, onDelete, onClickTitle } = props

    // const [treeData, setData] = useState(null)
    let { data } = props

    const convertToTreeData = (data) => {
        if (!data) return []
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

    const treeData = useMemo(() => {
        return convertToTreeData(data)
    }, [data])

    const titleRender = (nodeData) => {
        return (
            <div>
                <Space>
                    <span onClick={onClickTitle} >{nodeData.title}</span>
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

    return (
        <div>
            <Tree
                treeData={treeData}
                showLine
                titleRender={titleRender}
                selectable={false}
                expandAction='click'
            />
        </div>
    )
}
