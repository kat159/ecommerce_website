import React from 'react'
import { Tree, Space, message, Tag, Button, Form } from 'antd'
import { DeleteOutlined, EditOutlined, InsertRowRightOutlined, PlusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import DeleteConfirm from '../PopConfirm/DeleteConfirm'
import MyCRUDPopForm from '../Form/MyCRUDPopForm'
import { useState } from 'react'
import { useEffect } from 'react'
import constant from '../../utils/constant'
import MyCRUDFormHandler from './MyCRUDFormHandler'
import { uniqueId } from 'lodash'
import { useMemo } from 'react'
import { set } from 'lodash'
import { useForm } from 'antd/es/form/Form'
import { max } from 'lodash'
import { drop } from 'lodash'
import MySpace from '../Layout/MySpace'


const { TREE, TAG_GROUP, TABLE } = constant
const typeMapper = {
    [TREE]: MyTree,
    [TAG_GROUP]: MyTagGroup,
    // [TABLE]: MyTable,
}

const events = {
    CLICK_INSERT: 'CLICK_INSERT',
    CLICK_EDIT: 'CLICK_EDIT',
    CLICK_DELETE: 'CLICK_DELETE',

    CLICK_CONFIRM: 'CLICK_CONFIRM', // confirm the insert/edit operation
    CLICK_CANCEL: 'CLICK_CANCEL', // cancel the insert/edit operation
}

const { IDLE = 'idle', INSERT, EDIT, DELETE } = constant

export default function MyCRUDDataDisplayerHandler({
    type,  // tell handler which type of displayer component to use, e.g. 'table', 'tree', tag-group, ...
    primaryId,
    crudManager,
    editableFields,
    formType,
    bulkEdit = false,
    fakeSubmit = false,
    serviceKey,
    rules,
    key,
    formItemLabel,
    ...props // props for the displayer component
}) {
    const { childrenFieldName = 'children', idFieldName = 'id', titleFieldName = 'title', parantIdFieldName = 'parentId' } = props
    console.log('formType', formType)
    const originalService = crudManager.getCrudService(serviceKey)
    const popConfirmWhenDelete = !bulkEdit && !fakeSubmit // if both false, will delete from database immediately, popconfirm first
    const { sortOrderFieldName } = props
    let service = originalService
    if (primaryId) { // if primaryId is provided, it's relational data
        const newService = {
            ...originalService,
            get: (id) => originalService.get(id),
            getAll: () => originalService.getAll(primaryId),
            add: (dto) => originalService.add(dto, primaryId),
            update: (dto, oldDto) => originalService.update(dto, oldDto),
            remove: (dto) => originalService.remove(dto, primaryId),
        }
        service = newService
    } else {
    }

    const [data, setData] = useState([])
    const [status, setStatus] = useState(IDLE)
    const [draggable, setDraggable] = useState(sortOrderFieldName ? true : false)
    const [editingNode, setEditingNode] = useState(null)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        const data = await service.getAll()
        setData(data)
    }

    const onClickInsert = (nodeData) => {
        if (nodeData) {
            service.get(nodeData[idFieldName]).then((data) => {
                setEditingNode(data)
                setStatus(INSERT)
            })
        } else {
            setEditingNode(null)
            setStatus(INSERT)
        }
    }

    const onClickEdit = (nodeData) => {
        service.get(nodeData[idFieldName]).then((data) => {
            setEditingNode(data)
            setStatus(EDIT)
        })
    }

    const onClickDelete = (nodeData) => {
        service.get(nodeData[idFieldName]).then((dto) => {
            service.remove(dto).then(() => {
                if (!fakeSubmit && !bulkEdit) {
                    service.submit().then(() => fetchData())
                } else {
                    fetchData()
                }
            })
        })
    }

    const onFormSubmit = async (data) => {
        /**
         * 1. fakeSubmit && bulkEdit -> add/update when confirmAll button clicked, never submit in this component
         * 2. fakeSubmit && !bulkEdit -> add/update here, never submit in this component
         * 3. !fakeSubmit && bulkEdit -> add/update here, create confirmAll button to trigger submit, cancelAll button to trigger service.cancel
         * 4. !fakeSubmit && !bulkEdit -> add/update here & submit here
         */
        if (status === INSERT) {
            if (type === TREE) {
                data[parantIdFieldName] = editingNode[idFieldName] // set the parent id of the new node to the id of the node that triggers the insert
            }
            await service.add(data) // Insert the new node
        } else if (status === EDIT) {
            data[idFieldName] = editingNode[idFieldName] // set the id of the node to be updated
            await service.update(data, editingNode)
        }

        if (!fakeSubmit && !bulkEdit) {
            await service.submit()
        }
        await fetchData()
        setStatus(IDLE)
    };

    const onFormCancel = () => {
        /**
         * AttrGroup打开的form是为了新增或编辑子节点，或者更改自身数值
         * form不会负责delete， 只负责insert、edit
         * cancel的case：
         * case1: screen insert, pixel insert --> 取消自己的addMap(onInsert为了获得tmpid，传给子节点， add了) + 取消parentId=curId的所有修改edit/add/delete
         * case2: screen edit, pixel edit --> 取消自己的editMap + 取消parentId=curId的所有修改edit/add/delete
         */
        setStatus(IDLE);
        service.cancel(editingNode[idFieldName]) // 取消子节点的新增或编辑
    }

    return (
        <div>
            {
                typeMapper[type] && typeMapper[type]({
                    ...props,
                    data, setData, service,
                    onClickInsert, onClickEdit, onClickDelete,
                    draggable,
                    popConfirmWhenDelete,
                    key,
                    formItemLabel,
                })
            }
            {
                (status === EDIT || status === INSERT)
                && <MyCRUDFormHandler
                    editableFields={editableFields}
                    status={status}
                    editingNode={editingNode}
                    onSubmit={onFormSubmit}
                    onCancel={onFormCancel}
                    title={status === INSERT ? 'Insert' : 'Edit'}
                    type={formType}
                    crudManager={crudManager}
                />
            }
        </div>
    )
}

// Tree with CRUD features
function MyTree(props) {

    // titleFieldName -> the field name of the field in the data that will be displayed as the title of the node
    const {
        childrenFieldName = 'children',
        idFieldName = 'id',
        titleFieldName = 'title',
        parantIdFieldName = 'parentId',
        levelFieldName = 'level',
        maxLevel = 10,
    } = props

    const { data, setData, service } = props
    const { key, formItemLabel } = props
    let { onClickInsert, onClickEdit, onClickDelete, popConfirmWhenDelete } = props
    const { draggable, } = props
    const {
        insertIconRender = (props) => <PlusCircleOutlined {...props} />,
        editIconRender = (props) => <EditOutlined {...props} />,
        deleteIconRender = (props) => <DeleteOutlined {...props} />,
    } = props

    const convertToTree = (_data) => {
        if (!_data) return []
        const data = [..._data]
        const roots = data.filter(dto => dto[parantIdFieldName] === 0)
        // init children list
        data.forEach(dto => dto.children = [])
        // id to dto map
        const map = new Map(data.map(dto => [dto[idFieldName], dto]))
        // add children to parent node
        data.forEach(dto => {
            if (dto[parantIdFieldName]) {
                const parent = map.get(dto[parantIdFieldName])
                if (parent) {
                    parent.children.push(dto)
                }
            }
        })
        // convert to antd Tree data
        const convertToAntdTreeData = (data) => {
            return data.map(dto => {
                const children = convertToAntdTreeData(dto.children)
                return {
                    ...dto,
                    key: dto[idFieldName],
                    title: dto[titleFieldName],
                    children: children
                }
            })
        }

        return convertToAntdTreeData(roots)
    }

    const treeData = useMemo(() => {
        return convertToTree(data)
    }, [data])

    const onInsert = (nodeData) => {
        return e => {
            e.stopPropagation()
            if (nodeData.level >= maxLevel) {
                message.error(`Cannot insert node at level ${nodeData.level + 1} because the max level is ${maxLevel}`)
                return
            } else {
                onClickInsert(nodeData)
            }
        }
    }

    const onEdit = (nodeData) => {
        return e => {
            e.stopPropagation()
            onClickEdit(nodeData)
        }
    }

    const onDelete = (nodeData) => {
        return e => {
            e.stopPropagation()
            onClickDelete(nodeData)
        }
    }

    const titleRender = (dto) => {
        return (
            <MySpace >
                <span>{dto[titleFieldName]}</span>
                {insertIconRender({
                    className: 'my-click-icon',
                    onClick: onInsert(dto)
                })}
                {editIconRender({
                    className: 'my-click-icon',
                    onClick: onEdit(dto)
                })}
                {
                    popConfirmWhenDelete ? (
                        <DeleteConfirm onConfirm={onDelete(dto)} >
                            {deleteIconRender({
                                className: 'my-click-icon',
                            })}
                        </DeleteConfirm>
                    ) : (
                        deleteIconRender({
                            className: 'my-click-icon',
                            onClick: onDelete(dto)
                        })
                    )
                }
            </MySpace>
        )
    }

    const onDrop = async (info) => {
        const { dragNode, node: dropNode, dropPosition, dropToGap } = info
        console.log('=======================')
        console.log('dragNode', dragNode)
        console.log('dropNode', dropNode)
        console.log('dropPosition', dropPosition)
        console.log('dropToGap', dropToGap)
        const _checkMaxLevel = () => {
            const _getDepth = (curNode) => {
                if (!curNode) return 0
                if (curNode.children.length === 0) return 1
                const childrenDepths = curNode.children.map(child => _getDepth(child))
                return Math.max(...childrenDepths) + 1
            }
            const dragNodeDepth = _getDepth(dragNode)
            const dropNodeDepth = dropNode.level

            let newMaxLevel;

            if (dropToGap) { // insert as sibling
                newMaxLevel = dragNodeDepth + dropNodeDepth - 1
            } else if (!dropToGap) { // insert as child
                newMaxLevel = dragNodeDepth + dropNodeDepth
            }

            return newMaxLevel <= maxLevel
        }
        const _updateData = async () => {
            const promises = []
            const _updateLevel = (root, level) => {
                const oldDto = { ...root }
                const newDto = { ...root, level }
                console.log('upding', newDto, oldDto)
                promises.push(service.update(newDto, oldDto))
                root.children.forEach(child => _updateLevel(child, level + 1))
            }
            const _updateParentId = () => {
                const parentId = dropToGap ? dropNode.parentId : dropNode.id
                const oldDto = { ...dragNode }
                const newDto = { ...dragNode, parentId: parentId }
                dragNode.parentId = parentId
                promises.push(service.update(newDto, oldDto))
            }
            const _updateSortOrder = () => {

            }
            _updateParentId()
            console.log('update level', dragNode, dropNode, dropToGap, dropNode.level)
            _updateLevel(dragNode, dropToGap ? dropNode.level : dropNode.level + 1)
            return Promise.all(promises)
        }
        if (!_checkMaxLevel()) {
            message.error(`Exceed the max level ${maxLevel}`)
            return
        }
        _updateData().then(res => {

            service.submit().then(res => {

                service.getAll().then(res => {

                    setData(res)
                })
            })
        }).catch(err => {
            service.cancel()
        })
    }

    const getResult = () => {
        const getTree = () => (
            <div>
                <Tree
                    treeData={treeData}
                    showLine
                    titleRender={titleRender}
                    selectable={false}
                    expandAction='click'
                    draggable={draggable}
                    onDrop={onDrop}
                />
            </div>
        )
        return formItemLabel ? (
            <Form.Item label={formItemLabel} key={key} >
                {getTree()}
            </Form.Item>
        ) : (
            <div>
                {getTree()}
            </div>
        )
    }

    return getResult()
}

/** only for one to many */
function MyTagGroup(props) {
    const { data, titleFieldName } = props
    let { onClickInsert, onClickEdit, onClickDelete, popConfirmWhenDelete } = props
    const {
        insertIconRender = (props) => <PlusOutlined {...props} />,
        editIconRender = (props) => <EditOutlined {...props} />,
        deleteIconRender = (props) => <DeleteOutlined {...props} />,
    } = props
    const { key, formItemLabel } = props


    const onInsert = (dto) => {
        return (e) => {
            e.stopPropagation()
            onClickInsert(dto)
        }
    }

    const onEdit = (dto) => {
        return (e) => {
            e.stopPropagation()
            onClickEdit(dto)
        }
    }

    const onDelete = (dto) => {
        return (e) => {
            e.stopPropagation()
            onClickDelete(dto)
        }
    }

    const tagGroups = () => <MySpace >
        {
            data.map(dto => {
                return (
                    <Tag key={dto.id}>
                        <MySpace >
                            <span>{dto[titleFieldName]}</span>
                            {editIconRender({
                                className: 'my-click-icon',
                                onClick: onEdit(dto)
                            })}
                            {
                                popConfirmWhenDelete ? (
                                    <DeleteConfirm onConfirm={onDelete(dto)} >
                                        {deleteIconRender({
                                            className: 'my-click-icon',
                                        })}
                                    </DeleteConfirm>
                                ) : (
                                    deleteIconRender({
                                        className: 'my-click-icon',
                                        onClick: onDelete(dto)
                                    })
                                )
                            }
                        </MySpace>
                    </Tag>
                )
            })
        }
    </MySpace>

    const result = () => {
        let res;
        if (formItemLabel) {
            const label = <MySpace >
                <span>{formItemLabel}</span>
                {insertIconRender({
                    className: 'my-click-icon',
                    onClick: onInsert()
                })}
            </MySpace>
            res = <Form.Item label={label} key={key} >
                <div>{tagGroups()}</div>
            </Form.Item>
        } else {
            res = <MySpace >
                <Button type='dashed' onClick={onInsert()} >
                    Insert
                </Button>
                {tagGroups()}
            </MySpace>
        }
        return res;
    }

    return result()
}