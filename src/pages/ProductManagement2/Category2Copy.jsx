import React, {useEffect, useState} from 'react';
import {Button, Col, Collapse, Form, Input, Row, Tree, Typography, message, Select, Switch, Radio, Divider} from 'antd';
import dbmsProduct from "@/services/dbms-product";
import {history, useLocation} from "umi";
import {DeleteOutlined, EditOutlined, PlusOutlined} from "@ant-design/icons";
import {v4 as uuidv4} from 'uuid';
import './less.less'
import MyFormItem from "@/components/RelationalCRUD3/MyFormItem";

const categoryService = dbmsProduct.categoryController;

function Category2(props) {
  const [roots, setRoots] = useState([]);
  const [originRoots, setOriginRoots] = useState([]);
  const [editingNode, setEditingNode] = useState(null);
  const [form] = Form.useForm();
  const onDragEnter = (info) => {
    // expandedKeys 需要受控时设置
    // setExpandedKeys(info.expandedKeys)
  };
  const onDrop = (info) => {
    const dropKey = info.node.key;
    const dragKey = info.dragNode.key;
    const dropPos = info.node.pos.split('-');
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);
    const loop = (data, key, callback) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].key === key) {
          return callback(data[i], i, data);
        }
        if (data[i].children) {
          loop(data[i].children, key, callback);
        }
      }
    };
    const data = [...roots];

    // Find dragObject
    let dragObj;
    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });
    if (!info.dropToGap) {
      // Drop on the content
      loop(data, dropKey, (item) => {
        item.children = item.children || [];
        // where to insert 示例添加到头部，可以是随意位置
        item.children.unshift(dragObj);
      });
    } else if (
      (info.node.children || []).length > 0 &&
      // Has children
      info.node.expanded &&
      // Is expanded
      dropPosition === 1 // On the bottom gap
    ) {
      loop(data, dropKey, (item) => {
        item.children = item.children || [];
        // where to insert 示例添加到头部，可以是随意位置
        item.children.unshift(dragObj);
        // in previous version, we use item.children.push(dragObj) to insert the
        // item to the tail of the children
      });
    } else {
      let ar = [];
      let i;
      loop(data, dropKey, (_item, index, arr) => {
        ar = arr;
        i = index;
      });
      if (dropPosition === -1) {
        ar.splice(i, 0, dragObj);
      } else {
        ar.splice(i + 1, 0, dragObj);
      }
    }
    setRoots(data);
  };
  const formRef = React.createRef();
  const validate = async (namePath = []) => {
    try {

      const data = await form.validateFields(namePath);



      return true
    } catch (error) {
      form.scrollToField(error.errorFields[0].name, {
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest',
        scrollMode: 'if-needed',
      });

      return false
    }
  }
  const onSelectNode = async (selectedKeys, info) => {
    try {
      const data = await form.validateFields();

      const selectedNode = info.node;
      setEditingNode(selectedNode);
    } catch (error) {
      form.scrollToField(error.errorFields[0].name, {
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest',
        scrollMode: 'if-needed',
      });
    }
  }
  const onClickSaveAll = async () => {

  }
  const onDeleteNode = (node) => {
    const helper = (nodes) => {
      const res = nodes.filter((n) => n.key !== node.key);
      res.forEach((n) => {
        n.children = helper(n.children);
      })
      return res;
    }
    if (node.key === editingNode?.key) {
      setEditingNode(null);
    }
    const newData = helper(roots);
    setRoots(newData);
  }
  const onClickAddRootCategory = () => {
    addChildAt(0)
  }
  const addChildAt = (key) => {
    const id = uuidv4();
    const newNode = {
      title: 'New Category',
      name: 'New Category',
      key: id,
      id: id,
      icon: null,
      children: [],
      attributeGroups: []
    }
    let level = 1
    const findChildrenList = (nodes) => {
      for (let i = 0; i < nodes.length; i++) {

        if (nodes[i].key === key) {
          level = nodes[i].level + 1;
          newNode.level = level;
          return nodes[i].children;
        }
        return findChildrenList(nodes[i].children);
      }
    }

    const newRoots = [...roots];
    const children = key === 0 ? newRoots : findChildrenList(newRoots);

    if (level > 3) {
      message.error('Category level cannot exceed 3');
      return;
    }
    children.push(newNode);
    setRoots(newRoots);

  }
  const onAddNode = (node) => {
    addChildAt(node.key);
  }
  useEffect(() => {
    const fetchForest = async () => {
      const roots = (await categoryService.forestV2()).data;
      const convert = (nodes) => {
        return nodes.map((node) => {
          return {
            ...node,
            title: node.name,
            key: node.id,
            children: convert(node.children),
          };
        });
      }
      const data = convert(roots ?? []);
      setRoots(data);
      setOriginRoots(data);
    }
    fetchForest()
  }, [])
  const onSearch = (value) => {

  }
  useEffect(() => {  // intercept navigation
    let unlisten = history.listen((location, action) => {
      // stop the navigation
      unlisten();

      // do something here, e.g. show a confirmation dialog
      const confirmed = window.confirm('Save changes?');

      // resume the navigation
      if (confirmed) {
        history.push(location.location.pathname);
      } else {

      }
    });
    return () => {
      unlisten();
    };
  }, []);
  const EditFrom = () => {
    const onFinish = (values) => {

    }
    const [attrGroupLength, setAttrGroupLength] = useState(editingNode.attributeGroups?.length ?? 0);
    useEffect(() => {
      const initData = structuredClone(editingNode);
      const {attributeGroups} = initData;
      attributeGroups.forEach((group, index) => {
        group._expanded = index === 0;
        group.key = index;
        if (group.attributes) {
          group.attributes.forEach((attr, index) => {
            attr._expanded = index === 0;
            attr.key = index;
          })
        }
      })
      form.setFieldsValue(initData)
    }, [])
    return (
      <Form
        ref={formRef}
        form={form}
        className={'category-attributes-form'}
        scrollToFirstError={true}
      >
        <Form.Item hidden={true} name={'attributeGroups'}><Input/></Form.Item>
        <Collapse
          defaultActiveKey={[1]}
          onChange={(key) => {

          }}
        >
          <Collapse.Panel header="Category Basic Info" key="1" forceRender={true}>
            <Form.Item
              label="Name"
              name="name"
              rules={[{required: true, message: 'Please input name!'}]}
            >
              <Input/>
            </Form.Item>
            <MyFormItem.Upload.Image
              label="Image"
              name="icon"
              form={form}
              rules={[{required: true, message: 'Please upload image!'}]}
            />
          </Collapse.Panel>
        </Collapse>
        <Divider
          orientation="left"
          style={{
            color: '#333',
            fontSize: '20px',
            fontWeight: '600',
          }}
        >
          Attribute Groups
          <PlusOutlined
            className={'my-click-icon'}
            style={{marginLeft: 10}}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              if (editingNode.level !== 3) {
                message.error('Only leaf category can add attribute group');
                return;
              }
              const newAttributeGroups = form.getFieldValue('attributeGroups');
              newAttributeGroups.push({
                name: '',
                id: uuidv4(),
                key: newAttributeGroups.length,
                attributes: [],
                _expanded: true,
              });
              form.setFieldsValue({attributeGroups: newAttributeGroups})
            }}
          />
        </Divider>
        <Form.Item
          noStyle={true}
          shouldUpdate={(prevValues, currentValues) => prevValues.attributeGroups?.length !== currentValues.attributeGroups?.length}
        >
          {() => {

            return (
              <Collapse
                activeKey={
                  form.getFieldValue('attributeGroups')?.filter((group) => group._expanded)?.map((group) => group.key)
                }
                onChange={(key) => {
                  const preKey = form.getFieldValue('attributeGroups')?.filter((group) => group._expanded)?.map((group) => group.key.toString())
                  const newKey = key.map((k) => k.toString());

                  const changedKey = preKey.filter((k) => !newKey.includes(k))[0] ?? newKey.filter((k) => !preKey.includes(k))[0];

                  const path = ['attributeGroups', changedKey, 'attributes']
                  const fields = form.getFieldValue(path);

                  const pathToValidate = fields.map((_, index) => [...path, index, 'name']);  // check name

                  validate(pathToValidate).then(res => {
                    if (res !== false) {
                      const newAttributeGroups = form.getFieldValue('attributeGroups');
                      newAttributeGroups.forEach((group) => {
                        group._expanded = key.includes(group.key.toString());
                      })
                      form.setFieldsValue({attributeGroups: newAttributeGroups})
                    }
                  })
                }}
              >
                {form.getFieldValue('attributeGroups')?.map((attributeGroup, groupIndex) => (
                  // {attributeGroups?.map((attributeGroup, groupIndex) => (
                  <Collapse.Panel
                    key={groupIndex}
                    forceRender={true}
                    // collapsible={'icon'}
                    extra={
                      <DeleteOutlined
                        className={'my-click-icon'}
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          const newAttributeGroups = form.getFieldValue('attributeGroups');
                          newAttributeGroups.splice(groupIndex, 1);
                          form.setFieldsValue({attributeGroups: newAttributeGroups})
                        }}
                      />
                    }
                    header={
                      <Form.Item
                        onClick={(e) => {
                          e.preventDefault()
                        }}
                        required={true}
                        label={<span>
                    {`Attribute Group ${groupIndex + 1}`}
                  </span>}
                        style={{marginBottom: 0, marginRight: 10}}
                        name={['attributeGroups', groupIndex, 'name']}
                        rules={[{required: true, message: 'Please input name!'}]}
                      >
                        <Input
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}

                        />
                      </Form.Item>
                    }
                  >
                    <Divider
                      orientation="left"
                      style={{
                        color: '#333',
                        fontSize: '20px',
                        fontWeight: '600',
                      }}
                    >
                      Attributes
                      <PlusOutlined
                        className={'my-click-icon'}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          const newAttributeGroups = form.getFieldValue('attributeGroups');
                          newAttributeGroups[groupIndex].attributes.push({
                            name: '',
                            type: 0,
                            id: uuidv4(),
                            key: newAttributeGroups[groupIndex].attributes.length,
                            searchStatus: 0,
                            _expanded: true,
                          });
                          form.setFieldsValue({attributeGroups: newAttributeGroups})

                        }}
                        style={{
                          marginBottom: 10, marginLeft: 10
                        }}
                      />
                    </Divider>
                    <Form.Item
                      noStyle={true}
                      shouldUpdate={
                        (prevValues, currentValues) =>
                          JSON.stringify(prevValues.attributeGroups?.[groupIndex]?.attributes)
                          !== JSON.stringify(currentValues.attributeGroups?.[groupIndex]?.attributes)
                      }
                    >
                      {
                        () => {
                          return <Collapse
                            activeKey={
                              attributeGroup.attributes?.filter((attr) => attr._expanded)?.map((attr) => attr.key)
                            }
                            onChange={(key) => {
                              const newAttributeGroups = form.getFieldValue('attributeGroups');

                              newAttributeGroups[groupIndex].attributes.forEach((attr) => {
                                attr._expanded = key.includes(attr.key.toString());
                              })
                              form.setFieldsValue({attributeGroups: newAttributeGroups})
                            }}
                          >
                            {attributeGroup?.attributes?.map((attribute, attrIndex) => (
                              <Collapse.Panel
                                key={attrIndex}
                                forceRender={true}
                                extra={<DeleteOutlined
                                  className={'my-click-icon'}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    const newAttributeGroups = form.getFieldValue('attributeGroups').map((group) => {

                                      return {
                                        ...group,
                                        attributes: group.attributes.filter((attr, index) => index !== attrIndex)
                                      }
                                    })

                                    form.setFieldValue('attributeGroups', newAttributeGroups)
                                  }}
                                />}
                                header={
                                  <Form.Item
                                    onClick={(e) => {
                                      e.preventDefault()
                                    }}
                                    required={true}
                                    label={<span>
                              {`Attribute ${attrIndex + 1}`}
                            </span>}
                                    style={{marginBottom: 0, marginRight: 10}}
                                    name={['attributeGroups', groupIndex, 'attributes', attrIndex, 'name']}
                                    rules={[{required: true, message: 'Please input name!'}]}
                                  >
                                    <Input onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                    }}/>

                                  </Form.Item>
                                }
                              >
                                <Form.Item
                                  label={'Is Filter For Search'}
                                  name={['attributeGroups', groupIndex, 'attributes', attrIndex, 'searchStatus']}
                                  normalize={(value) => {
                                    return value === true ? '1' : '0'
                                  }}
                                  valuePropName={'checked'}
                                >
                                  <Switch
                                    checkedChildren="Yes"
                                    unCheckedChildren="No"
                                  />
                                </Form.Item>
                                <Form.Item
                                  label={'Type'}
                                  name={['attributeGroups', groupIndex, 'attributes', attrIndex, 'type']}

                                >
                                  <Radio.Group>
                                    <Radio value={0}>
                                      Sale Related
                                    </Radio>
                                    <Radio value={1}>
                                      Specification
                                    </Radio>
                                  </Radio.Group>
                                </Form.Item>
                                <MyFormItem.Input.MultiText
                                  label={'Values Options'}
                                  name={['attributeGroups', groupIndex, 'attributes', attrIndex, 'selectableValueList']}
                                />
                              </Collapse.Panel>
                            ))}
                          </Collapse>
                        }
                      }

                    </Form.Item>

                  </Collapse.Panel>
                ))}
              </Collapse>
            )
          }}
        </Form.Item>
        <Form.Item>
          <Button onClick={onFinish}>Save</Button>
        </Form.Item>
      </Form>
    )
  }
  return (
    <Row
      gutter={[16, 16]}
    >
      <Col span={10}
      >
        <Row
          style={{
            marginBottom: 8,
          }}
        >
          <Col>
            <Input.Search
              placeholder="search category name"

              size={"middle"}
              enterButton
              allowClear
            />
          </Col>
          <Col>
            <Button
              type="primary"
              style={{
                marginLeft: 8,
              }}
              onClick={onClickAddRootCategory}
            >
              Add a Root Category
            </Button>
          </Col>
          <Col>
            <Button
              type="primary"
              style={{
                marginLeft: 8,
              }}
              onClick={onClickSaveAll}
            >
              Save all Changes
            </Button>
          </Col>
        </Row>
        <Row
          style={{
            // backgroundColor: '#ffffff',
            // minHeight: '80vh',
            border: '1px solid #e8e8e8',
            borderRadius: '4px',
          }}
        >
          <Col
            span={24}
          >
            <Tree
              className="draggable-tree"
              selectedKeys={editingNode?.key ? [editingNode.key] : []}
              draggable
              blockNode
              onDragEnter={onDragEnter}
              onDrop={onDrop}
              treeData={roots}
              expandAction='click'
              style={{}}
              onSelect={onSelectNode}
              titleRender={(node) => {
                return <span>
                {node.name}
                  <PlusOutlined
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddNode(node);
                    }}
                  />
                <DeleteOutlined
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteNode({...node, key: node.id});
                  }}
                />
              </span>
              }}
            />
          </Col>
        </Row>
      </Col>
      <Col span={14}
      >
        {editingNode && <EditFrom/>}
      </Col>
    </Row>
  );
}

export default Category2;
