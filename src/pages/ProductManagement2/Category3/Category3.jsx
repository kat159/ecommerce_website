import React, {useEffect, useState} from 'react';
import {
  Button,
  Col,
  Collapse,
  Form,
  Input,
  Row,
  Tree,
  Typography,
  message,
  Select,
  Switch,
  Radio,
  Divider,
  Modal, Spin
} from 'antd';
import dbmsProduct from "@/services/dbms-product";
import {history, useLocation} from "umi";
import {DeleteOutlined, EditOutlined, PlusOutlined} from "@ant-design/icons";
import {v4 as uuidv4} from 'uuid';
import MyFormItem from "@/components/RelationalCRUD3/MyFormItem";
import myFormUtils from "@/utils/myFormUtils";
import AttrGroupEditor from "@/pages/ProductManagement2/Category3/AttrGroupEditor";

const categoryService = dbmsProduct.categoryController;

function Category3(props) {
  const [roots, setRoots] = useState([]);
  const [originRoots, setOriginRoots] = useState([]);
  const [editingNode, setEditingNode] = useState(null);
  const [editeMode, setEditeMode] = useState(false);
  const [form] = Form.useForm();
  const [loadingText, setLoadingText] = useState(null);
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
  const onSelectNode = async (selectedKeys, info) => {
    if (editeMode) {
      try {
        const data = await form.validateFields();
        console.log('selectedKeys', selectedKeys);
        console.log('info', info);
        console.log('roots', roots);
        console.log('data', data);
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
    } else {
      const selectedNode = info.node;
      setEditingNode(selectedNode);
    }
  }
  const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  const checkChanges = async () => {
    await wait(1000);
    return true
  }
  const saveChanges = async () => {
    await wait(1000);
    return true
  }
  const saveAll = async () => {
    try {
      setLoadingText('Checking Changes...');
      await checkChanges();
      setLoadingText('Saving Changes...');
      await saveChanges();
      message.success('Saved Successfully');
      setLoadingText(null);
      return true;
    } catch (e) {
      message.error('Failed to save');
      setLoadingText(null);
      throw e
    }
  }
  const onClickSaveAll = async () => {

  }
  const onDeleteNode = (node) => {
    if (!editeMode) return
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
    if (editeMode) {
      myFormUtils.validateAndScrollToError(form, []).then(
        res => {
          addChildAt(0)
        },
        err => {
        }
      )
    }
  }
  const addChildAt = (key) => {
    if (!editeMode) return;
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
    if (editeMode) {
      addChildAt(node.key);
    }
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
  // intercept navigation
  useEffect(() => {
    let unlisten = history.block((location, action) => {
      // stop the navigation
      unlisten();
      // do something here, e.g. show a confirmation dialog
      if (editeMode) {
        Modal.confirm({
          title: 'Save changes?',
          onOk: async () => {
            console.log('ok')
            await saveAll().then(
              res => {
                console.log('push it')
                history.push(location.location.pathname);
              },
              err => {

              }
            )
          },
          onCancel: () => {
            console.log('Cancel');
            history.push(location.location.pathname);
          },
          okText: 'Yes',
          cancelText: 'No',
        });
      } else {
        console.log('editmode ', editeMode)
        history.push(location.location.pathname);
      }
    });
    return () => {
      unlisten();
    };
  }, [editeMode]);
  return (
    <Spin spinning={loadingText !== null}
          tip={<Typography.Title
            level={4}
            style={{color: '#3f6eb7'}}
          >{loadingText}</Typography.Title>}
    >
      <Row
        gutter={[16, 16]}
      >
        <Col span={10}
        >
          <Row
            style={{
              marginBottom: 8,
              alignItems: 'center',
            }}
          >
            {/*<Col>*/}
            {/*  <Input.Search*/}
            {/*    placeholder="search category name"*/}

            {/*    size={"middle"}*/}
            {/*    enterButton*/}
            {/*    allowClear*/}
            {/*  />*/}
            {/*</Col>*/}
            <Col>
              <Switch
                checked={editeMode}
                onChange={(checked) => {
                  console.log('checked', checked)
                  if (checked === false) {
                    Modal.confirm({
                      title: 'Save changes?',
                      onOk: () => {
                        console.log('ok')
                        saveAll().then(
                          res => {
                            setEditeMode(checked)
                          },
                          err => {

                          }
                        )
                      },
                      onCancel: () => {
                        console.log('Cancel');
                        setEditeMode(checked)
                      },
                      okText: 'Yes',
                      cancelText: 'No',
                    });
                  } else {
                    setEditeMode(checked)
                  }
                }}
                style={{
                  marginLeft: 8,
                }}
                checkedChildren={'Editing'}
                unCheckedChildren={'View Only'}
                size={'default'}
              />
            </Col>
            {
              editeMode && <Col>
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
            }
            {
              editeMode && <Col>
                <Button
                  type="primary"
                  style={{
                    marginLeft: 8,
                  }}
                  onClick={onClickSaveAll}
                >
                  Save all
                </Button>
              </Col>
            }

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
                      className={editeMode ? `my-click-icon` : `my-click-icon-disabled`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!editeMode) return
                        onAddNode(node);
                      }}
                      style={{marginLeft: 8,}}
                    />
                  <DeleteOutlined
                    className={editeMode ? `my-click-icon` : `my-click-icon-disabled`}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!editeMode) return
                      onDeleteNode({...node, key: node.id});
                    }}
                    style={{marginLeft: 8,}}
                  />
                </span>
                }}
              />
            </Col>
          </Row>
        </Col>
        <Col span={14}
        >
          {
            editingNode && <AttrGroupEditor
              data={editingNode}
              form={form}
              editeMode={editeMode}
            />
          }
        </Col>
      </Row>
    </Spin>
  );
}

export default Category3;
