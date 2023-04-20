import React, {useEffect, useState} from 'react';
import {Button, Collapse, Divider, Form, Input, message, Radio, Switch} from "antd";
import MyFormItem from "@/components/RelationalCRUD3/MyFormItem";
import {DeleteOutlined, PlusOutlined} from "@ant-design/icons";
import {v4 as uuidv4} from "uuid";
import myFormUtils from "@/utils/myFormUtils";

function AttrGroupEditor({
  data, form, editeMode
}) {
  useEffect(() => {
    const initData = structuredClone(data);
    const {attributeGroups} = initData;
    attributeGroups.forEach((group, index) => {
      // group._expanded = index === 0;
      group._expanded = false;
      group.key = index;
      if (group.attributes) {
        group.attributes.forEach((attr, index) => {
          // attr._expanded = index === 0;
          attr._expanded = false;
          attr.key = index;
        })
      }
    })
    form.setFieldsValue(initData)
  }, [])
  return (
    <div>
      <Form
        disabled={!editeMode}
        form={form}
        className={'category-attributes-form'}
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
            disabled={!editeMode}
            className={editeMode ? `my-click-icon` : `my-click-icon-disabled`}
            style={{marginLeft: 10}}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              if (!editeMode) return
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

                  // const openedKey = newKey.filter((k) => !preKey.includes(k)); // 开启的时候不检查
                  const closedKey = preKey.filter((k) => !newKey.includes(k))?.[0];
                  if (closedKey) {
                    const path = ['attributeGroups', closedKey, 'attributes']
                    myFormUtils.validateAndScrollToError(form, path).then(
                      res => {

                        const newAttributeGroups = form.getFieldValue('attributeGroups');
                        newAttributeGroups.forEach((group) => {
                          group._expanded = key.includes(group.key.toString());
                        })
                        form.setFieldsValue({attributeGroups: newAttributeGroups})
                      },
                      err => {

                      }
                    )
                  } else {
                    const newAttributeGroups = form.getFieldValue('attributeGroups');
                    newAttributeGroups.forEach((group) => {
                      group._expanded = key.includes(group.key.toString());
                    })
                    form.setFieldsValue({attributeGroups: newAttributeGroups})
                  }

                  // const fields = form.getFieldValue(path);

                  // const pathToValidate = fields.map((_, index) => [...path, index, 'name']);  // check name

                  // // validate(pathToValidate).then(res => {
                  // //   if (res !== false) {
                  // //     const newAttributeGroups = form.getFieldValue('attributeGroups');
                  // //     newAttributeGroups.forEach((group) => {
                  // //       group._expanded = key.includes(group.key.toString());
                  // //     })
                  // //     form.setFieldsValue({attributeGroups: newAttributeGroups})
                  // //   }
                  // // })
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
                        className={editeMode ? `my-click-icon` : `my-click-icon-disabled`}
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          if (!editeMode) return
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
                        className={editeMode ? `my-click-icon` : `my-click-icon-disabled`}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (!editeMode) return
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
                      // dependencies={['attributeGroups', groupIndex, 'attributes']}
                      shouldUpdate={
                        (prevValues, currentValues) => {

                          return true

                          // return prevValues.attributeGroups?.[groupIndex]?.attributes?.length
                          //   !== currentValues.attributeGroups?.[groupIndex]?.attributes?.length

                          // return JSON.stringify(prevValues.attributeGroups?.[groupIndex]?.attributes)
                          //   !== JSON.stringify(currentValues.attributeGroups?.[groupIndex]?.attributes)
                        }
                      }
                    >
                      {
                        () => {
                          return <Collapse
                            activeKey={
                              form.getFieldValue('attributeGroups')?.[groupIndex]?.attributes?.filter((attr) => attr._expanded)?.map((attr) => attr.key)
                            }
                            onChange={(key) => {
                              const newAttributeGroups = form.getFieldValue('attributeGroups');

                              newAttributeGroups[groupIndex].attributes.forEach((attr) => {
                                attr._expanded = key.includes(attr.key.toString());
                              })
                              form.setFieldsValue({attributeGroups: newAttributeGroups})
                            }}
                          >
                            {form.getFieldValue('attributeGroups')?.[groupIndex]?.attributes?.map((attribute, attrIndex) => (
                              <Collapse.Panel
                                key={attrIndex}
                                forceRender={true}
                                extra={<DeleteOutlined
                                  className={editeMode ? `my-click-icon` : `my-click-icon-disabled`}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    if (!editeMode) return
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
                                    return value === true ? 1 : 0
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
      </Form>
    </div>
  );
}

export default AttrGroupEditor;
