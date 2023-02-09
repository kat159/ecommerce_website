import React from 'react'
import MyEditableTree from '../../components/Tree/MyEditableTree'
import { useState, useEffect } from 'react'
import productService from '../../services/dbms-product/index'
import { Form, Input } from 'antd';
import { Radio } from 'antd';
import MyImageUploader from '../../components/Form/MyImageUploader';
import { saveCategoryIcon } from '../../services/third-party-service/googleCloudStorage';
import constant from '../../utils/constant';
import MyCRUDTagGroup from '../../components/Form/MyCRUDTagGroup';
import CrudTree from '../../components/CrudComponent/CrudTree';
import { useMemo } from 'react';
import { useForm } from 'antd/es/form/Form';
import { PopForm } from '../../components/CrudComponent/CrudForms';
import { ImageUploader } from '../../components/CrudComponent/CrudFormItems';

const _catogoryService = productService.categoryController;
const _attrGroupService = productService.attributeGroupController;

const categoryService = {
    get: _catogoryService.get10,
    delete: _catogoryService.delete10,
    listAttrGroup: _catogoryService.listAttrGroup,
    addAttrGroup: _catogoryService.addAttrGroup,
    addAttrGroupList: _catogoryService.addAttrGroupList,
    update: _catogoryService.update10,
    getAll: _catogoryService.forest,
}

const attrGroupService = {
    get: _attrGroupService.get12,
    delete: _attrGroupService.delete12,
    update: _attrGroupService.update12,
}

const states = {
    IDLE: 'idle',
    LOADING: 'loading',
    INSERT: 'insert',
    EDIT: 'edit',
    DELETE: 'delete',
}

const childrenFieldName = 'children'
const idFieldName = 'id'
const titleFieldName = 'name'
const parentIdFieldName = 'parentId'

const _curTree = (props) =>
    <CrudTree
        service={categoryService}
        childrenFieldName={childrenFieldName}
        idFieldName={idFieldName}
        titleFieldName={titleFieldName}
        parantIdFieldName={parentIdFieldName}
        {...props}
    />

export default function () {

    const [treeData, setTreeData] = useState([])
    const [status, setStatus] = useState(states.IDLE)
    const [editingNode, setEditingNode] = useState(null)
    const [form] = useForm(null);

    const fetchTreeData = async () => {
        const data = await categoryService.getAll()
        setTreeData(data.data)
    }

    useEffect(() => {
        fetchTreeData()
    }, [])

    const onTreeClickTitle = (nodeData) => {
        return (e) => {

            e.stopPropagation()
        }
    }

    const onTreeClickInsert = (nodeData) => {
        return (e) => {

            e.stopPropagation()
            setStatus(states.INSERT)
            setEditingNode(nodeData)
        }
    }

    const onTreeClickEdit = (nodeData) => {
        return (e) => {

            e.stopPropagation()
            setStatus(states.EDIT)
            setEditingNode(nodeData)
            form.setFieldsValue(nodeData)
        }
    }

    const onTreeClickDelete = (nodeData) => {
        return (e) => {
            e.stopPropagation()
            categoryService.remove([nodeData[idFieldName]]).then(
                response => {
                    fetchTreeData()
                }
            )

        }
    }

    const onFormSubmit = (data) => {

        let promise = null;
        if (status === states.INSERT) {
            data[parentIdFieldName] = editingNode[idFieldName] // set the parent id of the new node to the id of the node that triggers the insert
            promise = categoryService.add(data) // Insert the new node
        } else if (status === states.EDIT) {
            data[idFieldName] = editingNode[idFieldName] // set the id of the node to be updated
            promise = categoryService.update(data)
        }
        promise.then(
            response => {
                fetchTreeData()
                setStatus(states.IDLE)
            }
        )
    };

    const onFormCancel = () => {
        setStatus(states.IDLE)
    }

    // const editableFields = [
    //     {
    //         dataFieldName: 'name',
    //         formFieldName: 'Category Name',
    //         // dataRender: (text, record, index) => <>{text}</>,
    //         dataEntryRender: (props) => <Input />
    //     },
    //     {
    //         dataFieldName: '-1',
    //         formFieldName: 'Attribute Groups',
    //         isRelationalData: true,
    //         relationship: constant.ONE_TO_MANY,
    //         shouldDisplay: (record) => record.level === 3,
    //         service: {
    //             getAll: catogoryService.listAttrGroup,
    //             add: catogoryService.addAttrGroup,
    //             addAll: catogoryService.addAttrGroupList,
    //             update: attrGroupService.update12,
    //             remove: attrGroupService.delete12,

    //         },
    //         // dataRender: (text, record, index) => <>{text}</>,
    //         dataEntryRender: (props) => <MyCRUDTagGroup {...props} service={service} />
    //     }
    // ]

    return (
        <div>
            {_curTree({
                data: treeData,
                onInsert: onTreeClickInsert,
                onEdit: onTreeClickEdit,
                onDelete: onTreeClickDelete,
            })}
            {(status === states.INSERT || status === states.EDIT)
                && <PopForm
                    form={form}
                    title={status === states.INSERT ? 'Insert Category' : 'Edit Category'}
                    onSubmit={onFormSubmit}
                    onCancel={onFormCancel}
                >
                    <Form.Item
                        label="Category Name"
                        name="name"
                        rules={[{ required: true, message: 'Please input category name!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Category Icon"
                        name="icon"
                        rules={[{ required: true, message: 'Please input category icon!' }]}
                    >
                        <ImageUploader form={form} name='icon' />
                    </Form.Item>
                    <Form.Item
                        label="Attribute Groups"
                    >
                        
                    </Form.Item>
                </PopForm>
            }
        </div>
    )
}