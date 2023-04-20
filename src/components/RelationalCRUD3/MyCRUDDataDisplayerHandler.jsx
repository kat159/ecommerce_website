import React from 'react'
import {Tree, Space, message, Tag, Button, Form, Table, Col, Row, Input} from 'antd'
import {DeleteOutlined, EditOutlined, InsertRowRightOutlined, PlusCircleOutlined, PlusOutlined} from '@ant-design/icons'
import DeleteConfirm from '../PopConfirm/DeleteConfirm'
import MyCRUDPopForm from '../Form/MyCRUDPopForm'
import {useState} from 'react'
import {useEffect} from 'react'
import constant from '../../utils/constant'
import MyCRUDFormHandler from './MyCRUDFormHandler'
import {uniqueId} from 'lodash'
import {useMemo} from 'react'
import {set} from 'lodash'
import {useForm} from 'antd/es/form/Form'
import {max} from 'lodash'
import {drop} from 'lodash'
import MySpace from '../Layout/MySpace'
import {v4 as uuidv4} from 'uuid';
import MyTableItem from "@/components/RelationalCRUD3/MyTableItem";

const {TREE, TAG_GROUP, TABLE} = constant
const typeMapper = {
  [TREE]: MyTree,
  [TAG_GROUP]: MyTagGroup,
  [TABLE]: MyTable,
}

const events = {
  CLICK_INSERT: 'CLICK_INSERT',
  CLICK_EDIT: 'CLICK_EDIT',
  CLICK_DELETE: 'CLICK_DELETE',

  CLICK_CONFIRM: 'CLICK_CONFIRM', // confirm the insert/edit operation
  CLICK_CANCEL: 'CLICK_CANCEL', // cancel the insert/edit operation
}

const {IDLE = 'idle', INSERT, EDIT, DELETE, LOADING} = constant

export default function MyCRUDDataDisplayerHandler({
  relationship,
  displayerRender,
  ...props // props for the displayer component
}) {
  return relationship === constant.MANY_TO_MANY
    ? displayerRender({...props})
    : OneToManyHanlder({...props})
}

function OneToManyHanlder({
  type,  // tell handler which type of displayer component to use, e.g. 'table', 'tree', tag-group, ...
  primaryId,
  crudManager,
  editableFields,
  formType,
  bulkEdit = false,
  fakeSubmit = true,
  serviceKey,
  rules,
  key,
  formItemLabel,
  ...props // props for the displayer component
}) {
  const {
    childrenFieldName = 'children',
    idFieldName = 'id',
    titleFieldName = 'title',
    parantIdFieldName = 'parentId'
  } = props

  const originalService = crudManager.getCrudService(serviceKey)
  const popConfirmWhenDelete = !bulkEdit && !fakeSubmit // if both false, will delete from database immediately, popconfirm first
  const {sortOrderFieldName, entityName} = props
  let service = originalService
  if (primaryId) { // if primaryId is provided, it's relational data
    const newService = {
      ...originalService,
      get: (id) => originalService.get(id),
      getAll: () => originalService.getAll(primaryId),
      add: (dto) => originalService.add(dto, primaryId),
      update: (dto) => originalService.update(dto),
      remove: (id) => originalService.remove(id),
    }
    service = newService
  } else {
  }
  const [data, setData] = useState([])
  const [status, setStatus] = useState(IDLE)
  const [draggable, setDraggable] = useState(sortOrderFieldName ? true : false)
  const [editingNode, setEditingNode] = useState(null)
  const [tmpInsertId, setTmpInsertId] = useState(null)
  const [triggerChildFetch, setTriggerChildFetch] = useState(false)
  const fetchData = async () => {
    setTriggerChildFetch(!triggerChildFetch)
  }

  const onClickInsert = (dataToRecord) => { // some data related to the clicked record, e.g. the new level of tree
    // if (nodeData) {
    //     service.get(nodeData[idFieldName]).then((data) => {
    //         setEditingNode(data)
    //         setStatus(INSERT)
    //     })
    // } else {
    //     setEditingNode(null)
    //     setStatus(INSERT)
    // }
    if (!dataToRecord) {
      dataToRecord = {}
    }
    service.add(dataToRecord).then(tmpId => {
      dataToRecord[idFieldName] = tmpId
      setEditingNode(dataToRecord)
      setTmpInsertId(tmpId)
      setStatus(INSERT)
    })
    setStatus(INSERT)
  }

  const onClickEdit = (nodeData) => {
    service.get(nodeData[idFieldName]).then((data) => {
      setEditingNode(data)
      setStatus(EDIT)
    })
  }

  const onClickDelete = (nodeData) => {
    service.remove(nodeData.id).then(() => {
      if (!fakeSubmit && !bulkEdit) {
        service.submit().then(() => fetchData())
      } else {
        fetchData()
      }
    })
  }

  const onFormSubmit = async (data) => {
    /**
     * 1. fakeSubmit && bulkEdit -> add/update when confirmAll button clicked, never submit in this component
     * 2. fakeSubmit && !bulkEdit -> add/update here, never submit in this component
     * 3. !fakeSubmit && bulkEdit -> create a temporary cache service, add/update here, merge temporary cache to current cache when confirmAll button clicked
     * 4. !fakeSubmit && !bulkEdit -> add/update here & submit here
     */

    if (status === INSERT) {
      // if (type === TREE) {
      //     data[parantIdFieldName] = editingNode[idFieldName] // set the parent id of the new node to the id of the node that triggers the insert
      // }
      await service.add({...editingNode, ...data}) // Insert the new node
      // // await service.add(data) // Insert the new node
    } else if (status === EDIT) {
      data[idFieldName] = editingNode[idFieldName] // set the id of the node to be updated
      await service.update({...editingNode, ...data}) // Update the node
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
    // form中，修改的是外键表，
    // form confirm时，把外键表的cache合并到这里
    // form cancel時，要把外鍵表的修改删掉（不要删除这里的cache)
    //      同一个field的其他修改，在submit的时候就合并到这里了，所以不用管
    //      不同field的修改，也不用管。因为出现这个field的form。就说明其他field要么submit，要么cancel。如果submit，就已经合并在这， 如果是cancel，就已经清除
    if (status === INSERT) {
      if (tmpInsertId === null || tmpInsertId === undefined) {
        console.error('tmpInsertId is null or undefined')
      }
      service.remove(tmpInsertId)
      setTmpInsertId(null)
    }

    service.clearChildren()
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
          editableFields,
          triggerChildFetch
        })
      }
      {
        (status === EDIT || status === INSERT)
        && <MyCRUDFormHandler
          editableFields={editableFields}
          status={status}
          editingNode={{...editingNode}}
          onSubmit={onFormSubmit}
          onCancel={onFormCancel}
          title={(status === INSERT ? 'Insert' : 'Edit') + ` ${entityName}`}
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
    entityName,
  } = props

  const {data, setData, service, triggerChildFetch} = props
  const {key, formItemLabel} = props
  let {onClickInsert, onClickEdit, onClickDelete, popConfirmWhenDelete} = props
  const {draggable,} = props
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
  useEffect(() => {
    fetchData()
  }, [triggerChildFetch])

  const fetchData = async () => {
    const data = await service.getAll()
    setData(data)
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
        const toInsert = {
          [parantIdFieldName]: nodeData[idFieldName],
          [levelFieldName]: nodeData[levelFieldName] + 1,
        }
        onClickInsert(toInsert)
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
      <MySpace>
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
            <DeleteConfirm onConfirm={onDelete(dto)}>
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
    const {dragNode, node: dropNode, dropPosition, dropToGap} = info

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
        const oldDto = {...root}
        const newDto = {...root, level}

        promises.push(service.update(newDto, oldDto))
        root.children.forEach(child => _updateLevel(child, level + 1))
      }
      const _updateParentId = () => {
        const parentId = dropToGap ? dropNode.parentId : dropNode.id
        const oldDto = {...dragNode}
        const newDto = {...dragNode, parentId: parentId}
        dragNode.parentId = parentId
        promises.push(service.update(newDto, oldDto))
      }
      const _updateSortOrder = () => {

      }
      _updateParentId()

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

  const tree = <Tree
    treeData={treeData}
    showLine
    titleRender={titleRender}
    selectable={false}
    expandAction='click'
    draggable={draggable}
    onDrop={onDrop}
  />

  return formItemLabel ? (
    <Form.Item label={formItemLabel} key={key}>
      {tree}
    </Form.Item>
  ) : (
    <div>
      <Space direction={'vertical'}
             style={{width: '100%'}}
      >
        <Button type='primary' onClick={onInsert({level: 0, id: 0})}>
          Add a New {entityName}
        </Button>
        {tree}
      </Space>

    </div>
  )

  const getResult = () => {
    const tree = <Tree
      treeData={treeData}
      showLine
      titleRender={titleRender}
      selectable={false}
      expandAction='click'
      draggable={draggable}
      onDrop={onDrop}
    />

    return formItemLabel ? (
      <Form.Item label={formItemLabel} key={key}>
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

function MyTable({
  data, setData, service, triggerChildFetch,
  insertIconRender = (props) => <PlusOutlined {...props} />,
  editIconRender = (props) => <EditOutlined {...props} />,
  deleteIconRender = (props) => <DeleteOutlined {...props} />,
  onClickInsert, onClickEdit, onClickDelete, popConfirmWhenDelete,
  editableFields = [],
  formItemLabel,
  entityName,
  sortFieldName,
  actions,
}) {

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: constant.DEFAULT_PAGE_SIZE,
    total: 0,
    onChange: (current, pageSize) => {
      fetchData({current, pageSize})
    }
  })

  useEffect(() => {
    fetchData()
  }, [triggerChildFetch])

  const fetchData = async (params) => {
    const {current, pageSize} = pagination
    const {CURRENT_PAGE_STR, PAGE_SIZE_STR, TOTAL_STR} = constant
    const data = await service.page({
      [CURRENT_PAGE_STR]: current,
      [PAGE_SIZE_STR]: pageSize,
      ...params
    })
    const newPagination = {
      ...pagination,
      total: data[TOTAL_STR],
      pageSize: data[PAGE_SIZE_STR],
      current: data[CURRENT_PAGE_STR],
    }
    setPagination(newPagination)
    setData(data.list)

  }

  const tableData = useMemo(() => {
    return !data ? [] : data.map((dto, index) => {
      return {...dto, key: index}
    })
  }, [data])

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

  const columns = useMemo(() => {
    const result = [
      ...editableFields.map(field => {
        return {
          title: field.label,
          dataIndex: field.dataFieldName,
          key: field.dataFieldName,
          render: field.dataRender
        }
      }),
      {
        title: 'Action',
        key: 'action',
        render: (text, dto) => (
          <MySpace>
            {
              actions && actions.map(({render}, index) => {
                return render(text, dto, index);
              })
            }
            {editIconRender({
              className: 'my-click-icon',
              onClick: onEdit(dto)
            })}
            {
              popConfirmWhenDelete ? (
                <DeleteConfirm onConfirm={onDelete(dto)}>
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
        ),
      },
    ]
    return result
  }, [])

  const curTable = <Table
    size='small'
    columns={columns}
    dataSource={tableData}
    pagination={pagination}
  />

  const formLabel = formItemLabel && <MySpace>
    <span>{entityName}</span>
    {insertIconRender({
      className: 'my-click-icon',
      onClick: onInsert()
    })}
  </MySpace>

  const result = formItemLabel ? (
    <Form.Item label={formLabel}>
      {curTable}
    </Form.Item>
  ) : (
    < >
      <Space direction={'vertical'} style={{width: '100%'}}>
        {/*<Row>*/}
        {/*  <Col>*/}
        {/*//     <Input/>*/}
        {/*//   </Col>*/}
        {/*  <Col>*/}
        {/*    <Button type='primary' onClick={onInsert()}>*/}
        {/*      Add a new {entityName}*/}
        {/*    </Button>*/}
        {/*  </Col>*/}
        {/*</Row>*/}
        <MyTableItem.SearchAndAddHeader
          entityName={entityName}
          onInsert={onInsert()}
          onSearch={(value) => {
            fetchData({[sortFieldName]: value}).catch(e => {
              console.error(e)
            })
          }}
        />
        {curTable}
      </Space>
    </>
  )

  return result

  // return <Table
  //     size='small'
  //     columns={columns}
  //     dataSource={tableData}
  //     pagination={pagination}
  // />

}

/** only for one to many */
function MyTagGroup(props) {
  const {data, setData, service, triggerChildFetch, titleFieldName} = props
  let {onClickInsert, onClickEdit, onClickDelete, popConfirmWhenDelete} = props
  const {
    insertIconRender = (props) => <PlusOutlined {...props} />,
    editIconRender = (props) => <EditOutlined {...props} />,
    deleteIconRender = (props) => <DeleteOutlined {...props} />,
  } = props
  const {key, formItemLabel, entityName} = props

  useEffect(() => {
    fetchData()
  }, [triggerChildFetch])

  const fetchData = async () => {
    const data = await service.getAll()
    setData(data)
  }

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

  const TagGroups = () => <MySpace>
    {
      data.map(dto => {
        return (
          <Tag key={dto.id}>
            <MySpace>
              <span>{dto[titleFieldName]}</span>
              {editIconRender({
                className: 'my-click-icon',
                onClick: onEdit(dto)
              })}
              {
                popConfirmWhenDelete ? (
                  <DeleteConfirm onConfirm={onDelete(dto)}>
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

  const Result = () => {
    let res;
    if (formItemLabel) {
      const label = <MySpace>
        <span>{entityName}</span>
        {insertIconRender({
          className: 'my-click-icon',
          onClick: onInsert()
        })}
      </MySpace>
      res = <Form.Item label={label} key={key}>
        <div>
          {TagGroups()}
        </div>
      </Form.Item>
    } else {
      res = <MySpace>
        <Button type='dashed' onClick={onInsert()}>
          Insert
        </Button>
        {TagGroups()}
      </MySpace>
    }
    return res;
  }

  return Result()
}
