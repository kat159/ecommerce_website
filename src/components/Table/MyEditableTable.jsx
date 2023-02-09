import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { Button, Space, Table } from 'antd'
import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import constant from '../../utils/constant'
import MyCRUDPopForm from '../Form/MyCRUDPopForm'
import DeleteConfirm from '../PopConfirm/DeleteConfirm'
import './table.less'

export default function MyEditableTable(props) {

    const { service, serviceGetAll, serviceSave, serviceUpdate, serviceDelete } = props

    /*
        tableFields = [{
            dataFieldName: name,  // name of the field in the data (column name in the backend, see the typings.d.ts of the service folder)
            formFieldName: label, // label displayed in the table or editing form
            dataRender: // eg. (text, record, index) => <a>{text}</a>, will be assigned to 'render' property of antd table,  https://ant.design/components/table/#Column
            dataEntryComponent,  // data entry component displayed when edit(eg. <Input />, <Radio.Group />, etc.))
        }]
    */
    const { tableFields, idFieldName = 'id' } = props

    const [tableData, setTableData] = useState([])
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: constant.DEFAULT_PAGE_SIZE,
        total: 0,
        onChange: (page, pageSize) => {
            fetchData({ current: page, pageSize })
        }
    })

    const fetchData = ({ current, pageSize }) => {
        const { CURRENT_PAGE_STR, PAGE_SIZE_STR, TOTAL_STR } = constant

        service.page({
            [CURRENT_PAGE_STR]: current,
            [PAGE_SIZE_STR]: pageSize,
        }).then(
            response => {

                const newPagination = {
                    ...pagination,
                    total: response.data[TOTAL_STR],
                    pageSize: response.data[PAGE_SIZE_STR],
                    current: response.data[CURRENT_PAGE_STR],
                }
                const data = response.data.list.map((item, index) => {
                    return {
                        ...item,
                        key: index
                    }
                })
                setPagination(newPagination)
                setTableData(data)
            }
        )
    }

    useEffect(() => {
        fetchData(pagination)
    }, [])

    const dataColumn = tableFields.map((field, index) => {
        return {
            title: field.formFieldName,
            dataIndex: field.dataFieldName,
            key: index,
            render: field.dataRender
        }
    })
    const actionColumn = [
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <EditOutlined className='my-click-icon'
                        onClick={onEdit(record)}
                    />
                    <DeleteConfirm onConfirm={onDelete(record)} >
                        <DeleteOutlined className='my-click-icon'
                        />
                    </DeleteConfirm>
                </Space>
            ),
        }
    ]
    const columns = [...dataColumn, ...actionColumn]


    const INSERT = constant.INSERT;
    const EDIT = constant.EDIT;
    const [isEditing, setIsEditing] = useState(false)
    const [editType, setEditType] = useState(null)
    const [editingNode, setEditingNode] = useState(null)
    const [formFields, setFormFields] = useState(null)

    const onInsert = () => {
        return (e) => {

            // e.stopPropagation()
            setIsEditing(true)
            setEditType(INSERT)

            const newFormFields = tableFields.map(field => {
                return {
                    ...field,
                    initialValue: null
                }
            })
            setFormFields(newFormFields)
        }
    }

    const onEdit = (nodeData) => {
        return (e) => {

            e.stopPropagation()
            setIsEditing(true)
            setEditType(EDIT)
            setEditingNode(nodeData)

            const newFormFields = tableFields.map(field => {
                return {
                    ...field,
                    initialValue: nodeData[field.dataFieldName]
                }
            })
            setFormFields(newFormFields)
        }
    }

    const onDelete = (nodeData) => {
        return (e) => {
            e.stopPropagation()
            service.remove([nodeData[idFieldName]]).then(
                response => {
                    fetchData(pagination)
                }
            )

        }
    }
    const onFormSubmit = (data) => {

        let promise = null;
        if (editType === 'insert') {
            promise = service.add(data)
        } else if (editType === 'edit') {
            data[idFieldName] = editingNode[idFieldName]
            promise = service.update(data)
        }
        promise.then(
            response => {
                fetchData(pagination)
                setIsEditing(false);
            }
        )
    };

    const onFormCancel = () => {
        setIsEditing(false);
    }

    return (
        <div>
            <Button
                onClick={onInsert()}
                type="primary"
                style={{
                    marginBottom: 16,
                }}
            >Add a row</Button>
            <Table
                dataSource={tableData}
                columns={columns}
                pagination={pagination}
            />
            {isEditing && <MyCRUDPopForm
                onSubmit={onFormSubmit}
                onCancel={onFormCancel}
                title={editType === 'insert' ? 'Insert' : 'Edit'}
                formFields={formFields}
            />}
        </div>

    )
}
