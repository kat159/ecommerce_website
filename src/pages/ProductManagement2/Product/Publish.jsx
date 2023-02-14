import React, {useEffect, useMemo, useState} from 'react';
import {
  Button,
  Checkbox,
  Col,
  Collapse,
  Divider,
  Form, Image,
  Input,
  InputNumber,
  Row,
  Select,
  Space,
  Steps,
  Table
} from 'antd';
import dbmsProduct from "@/services/dbms-product";
import MyFormItem from "@/components/RelationalCRUD3/MyFormItem";
import constant from "@/utils/constant";
import MySteps from "@/components/Navigation/MySteps";
import {useForm} from "antd/es/form/Form";
import {PlusCircleOutlined, PlusOutlined} from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import MyDataEntry from "@/components/RelationalCRUD3/MyDataEntry";
import MySpace from "@/components/Layout/MySpace";
import {v4 as uuidv4} from 'uuid';

const categoryService = dbmsProduct.categoryController;
const brandService = dbmsProduct.brandController;

function Publish(props) {
  const [current, setCurrent] = useState(0);
  const [categoryForest, setCategoryForest] = useState([]);
  const [brandList, setBrandList] = useState([]);
  const [basicInfoForm] = useForm();
  const [saleAttrForm] = useForm();
  const [specAttrForm] = useForm();
  const [skuForm] = useForm();

  /** prev data for each form, to determine whether to re-fetch data  */
  const [prevBasicInfoFormData, setPrevBasicInfoFormData] = useState({});
  const [prevSaleAttrFormData, setPrevSaleAttrFormData] = useState({});
  const [prevSpecAttrFormData, setPrevSpecAttrFormData] = useState({});
  const [prevSkuFormData, setPrevSkuFormData] = useState({});
  /** data for generating form fields(not to submit)  */
  const [attrGroupWithAttrList, setAttrGroupWithAttrList] = useState([]);
  const [saleAttrs, setSaleAttrs] = useState([]); // depends on attrGroupWithAttrList
  const [skuList, setSkuList] = useState([]); // depends on saleAttrs
  const [skuFormBaseData, setSkuFormBaseData] = useState([]); // depends on skuList
  /** dynamic data for sku info form */
  const [skuInfoData, setSkuInfoData] = useState([]); // depends on skuList
  const fetchCategoryForest = async () => {
    const res = await categoryService.forest({});
    setCategoryForest(res.data);
  }
  const fetchBrandList = async () => {
    const res = await brandService.page12({[constant.PAGE_SIZE_STR]: 1000});
    setBrandList(res.data.list);
  }
  useEffect(() => {
    fetchCategoryForest();
    fetchBrandList();
  }, []);

  const onClickNextStep = async () => {
    console.log('onClickNextStep', current)
    if (current === 0) {
      // basic info form finished, *category* selected will affect the following forms
      // save basic info form
      const basicInfo = await basicInfoForm.validateFields();
      const categoryId = basicInfo.categoryId[basicInfo.categoryId.length - 1];
      const preCategoryId = prevBasicInfoFormData.categoryId
      if (categoryId !== preCategoryId) {
        // categoryId changed, fetch attribute data based on categoryId selected in basicInfoForm
        const res = await categoryService.getAllAttrGroupWithAttrList({id: categoryId});
        const attrGroupWithAttrList = res ? res.data ? res.data : [] : [];
        // get saleAttrs
        const saleAttrs = [];
        attrGroupWithAttrList.forEach((attrGroup) => {
          attrGroup.saleAttrs.forEach((attr) => {
            saleAttrs.push(attr);
          })
        })
        // set new form fields for following forms
        setSaleAttrs(saleAttrs);
        setAttrGroupWithAttrList(attrGroupWithAttrList);
        // clear all following forms
        saleAttrForm.resetFields();
        specAttrForm.resetFields();
        skuForm.resetFields();
        setSkuList([]);
        setPrevSpecAttrFormData([])
        setPrevSaleAttrFormData([])
        setPrevSkuFormData([])
      }
      basicInfoForm.setFieldValue('categoryId', categoryId);
      setPrevBasicInfoFormData(basicInfo);
    } else if (current === 1) {
      // spec attr form finished, this form has no variable that will affect the next forms
      const specAttrs = await specAttrForm.validateFields();
      setPrevSpecAttrFormData({...specAttrs});
    } else if (current === 2) {
      // sale attr form finished
      const saleAttrs = await saleAttrForm.validateFields();
      // convert saleAttrs to String, and compare to see if it does not change
      const saleAttrsStr = JSON.stringify(saleAttrs);
      const preSaleAttrsStr = JSON.stringify(prevSaleAttrFormData);
      if (saleAttrsStr !== preSaleAttrsStr) {
        // saleAttrs changed, generate new skuList
        // 不需要清空 skuForm, 因为 skuForm 里的数据, 如果category变了，会在step0里清空
        const newSkuList = [];
        const skuListTemplate = [
          {
            10: 'red', // color 的 attrId:
            11: '4GB', // memory 的 attrId:
            // sku info..
            name: 'product name + red + 4GB',
            description: 'about this item',
            title: 'product name + red + 4GB',
            subTitle: 'about this item',
            price: 100,
            saleCount: 0,
            imageIdList: [],
          }
        ]
        const toUploadImageListTemplate = [
          {
            fakeId: 1,
            base64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf',
          }
        ]
        const attrIdToName = {}; // {attrId: attrName}
        for (const attrGroup of attrGroupWithAttrList) {
          for (const attr of attrGroup.saleAttrs) {
            attrIdToName[attr.id] = attr.name;
          }
        }
        const generateSkuList = (attrIdList, index, tmpSku) => {
          if (index >= attrIdList.length) {
            // generate sku
            const sku = {};
            const skuAttrs = {};

            for (const attrId in tmpSku) {
              skuAttrs[attrId] = tmpSku[attrId];
            }
            sku.attrs = skuAttrs;
            sku.name = prevBasicInfoFormData.name;
            sku.description = prevBasicInfoFormData.description;
            sku.title = prevBasicInfoFormData.name;
            sku.subTitle = null;
            sku.price = null;
            sku.saleCount = null;
            sku.imageIdList = [];
            for (const attrId in tmpSku) {
              sku.name += ` ${tmpSku[attrId]}`;
              sku.description += ` ${attrIdToName[attrId]} ${tmpSku[attrId]}`;
              sku.title += ` ${tmpSku[attrId]}`;
            }
            newSkuList.push(sku);
            return;
          }
          const currentAttrId = attrIdList[index];
          const currentAttrValues = saleAttrs[currentAttrId] ?? [];
          for (const currentAttrValue of currentAttrValues) {
            tmpSku[currentAttrId] = currentAttrValue;
            generateSkuList(attrIdList, index + 1, tmpSku);
          }
        }
        const attrIdList = Object.keys(saleAttrs);
        generateSkuList(attrIdList, 0, {});
        console.log('newSkuList', newSkuList)
        setSkuList(newSkuList);

        const newFormSkuList = {};
        newSkuList.forEach((sku, index) => {
          const attrCombination = JSON.stringify(sku.attrs);
          newFormSkuList[attrCombination] = {...sku};
        })
        setSkuFormBaseData(newFormSkuList);
      }
      setPrevSaleAttrFormData(saleAttrs)

    } else if (current === 3) {
      // sku form finished
      console.log("==========Complete==========")
      const basicInfo = prevBasicInfoFormData
      const specAttrs = prevSpecAttrFormData
      const saleAttrs = prevSaleAttrFormData
      const skuListFormData = await skuForm.validateFields();
      const skuList = {
        ...skuListFormData,
        skuList: {...skuFormBaseData, ...skuListFormData.skuList}
      }
      console.log('basicInfo', basicInfo)
      console.log('specAttrs', specAttrs)
      console.log('saleAttrs', saleAttrs)
      console.log('skuListFormData', skuListFormData);
      console.log('skuList', skuList)
    }
  }
  const BasicInfoForm = ({form}) => {
    return (
      <div>
        <Form form={form}
        >
          <Form.Item
            label={'Product Image'}
            noStyle={true}
          >

          </Form.Item>
          {MyFormItem.Input.Text({label: "Name", name: "name"})}
          {MyFormItem.Input.TextArea({label: "Description", name: "description"})}

          {MyFormItem.Select.CascadeSelect({
            label: 'Category',
            name: 'categoryId',
            options: categoryForest,
            fieldNames: {label: 'name', value: 'id', children: 'children'},
          })}
          {MyFormItem.Select.Select({
            label: 'Brand',
            name: 'brandId',
            fieldNames: {label: 'name', value: 'id'},
            options: brandList,
          })}
          {MyFormItem.Upload.MultiImage({
            label: 'Product Image',
            name: 'productImageList',
          })
          }
        </Form>
      </div>
    );
  }
  const SaleAttrForm = ({form}) => {
    return (
      <div>
        <Form form={form}
        >
          {saleAttrs.map((attr, index) => {
            const {id, name, values, _adding} = attr;
            const options = values.map(v => {
              return {value: v, label: v}
            })
            const [inputValue, setInputValue] = useState('');
            return (
              <div key={index}
                   style={{
                     display: 'flex',
                     alignItems: 'top',
                   }}
              >
                <Space
                  style={{alignItems: 'unset',}}
                >
                  <Form.Item label={name} name={id}>
                    <Checkbox.Group options={options}/>
                  </Form.Item>
                  {
                    !_adding
                      ? <Button
                        type="primary"
                        onClick={() => {
                          setSaleAttrs(
                            saleAttrs.map((attr, i) => {
                                if (index === i) {
                                  return {...attr, _adding: true}
                                }
                                return attr;
                              }
                            ))
                        }}
                      >Add</Button>
                      : <Input.Group compact={true}
                                     onChange={(e) => {
                                       console.log('e', e)
                                       setInputValue(e.target.value)
                                     }}
                      >
                        {MyDataEntry.Input.AutoSizeText({
                          onChange: (value) => setInputValue(value)
                        })}
                        <Button
                          type="primary"
                          onClick={(e) => {
                            setSaleAttrs(
                              saleAttrs.map((attr, i) => {
                                  if (index === i) {
                                    return {...attr, _adding: false, values: [...attr.values, inputValue]}
                                  }
                                  return attr;
                                }
                              )
                            )
                          }}
                        >Add</Button>
                      </Input.Group>
                  }
                </Space>
              </div>
            )
          })}
        </Form>
      </div>
    )
  }
  const SpecAttrForm = ({form}) => {
    return (
      <div>
        <Form form={form}
        >
          {attrGroupWithAttrList.map((attrGroup, attrGroupIndex) => {
            const {id, name, specAttrs} = attrGroup;
            if (!specAttrs || specAttrs.length === 0) {
              return null;
            }
            console.log('attrGroup', attrGroup)
            return (
              <div key={attrGroupIndex}>
                {attrGroupIndex > 0 && <Divider/>}
                <h3>{name}</h3>
                {
                  attrGroup.specAttrs.map((attr, specAttrIndex) => {
                    const {id, name, values, _customValue} = attr
                    return (
                      <Space
                        style={{
                          alignItems: 'unset',
                          display: 'flex',
                        }}
                        key={specAttrIndex}
                      >
                        <Form.Item label={name} name={id}>
                          {!_customValue
                            ? MyDataEntry.Select.Select({
                              options: values.map(v => {
                                return {value: v, label: v}
                              })
                            })
                            : MyDataEntry.Input.AutoSizeText({})
                          }
                        </Form.Item>

                        <Form.Item>
                          <Checkbox
                            checked={_customValue}
                            onChange={(e) => {
                              console.log('e', e)
                              const newAttrGroupWithAttrList =
                                attrGroupWithAttrList.map((attrGroup, i) => {
                                  if (attrGroupIndex === i) {
                                    return {
                                      ...attrGroup,
                                      specAttrs: attrGroup.specAttrs.map((attr, j) => {
                                        if (specAttrIndex === j) {
                                          return {...attr, _customValue: e.target.checked}
                                        }
                                        return attr;
                                      })
                                    }
                                  }
                                  return attrGroup;
                                })
                              console.log('newAttrGroupWithAttrList', newAttrGroupWithAttrList)
                              setAttrGroupWithAttrList(
                                attrGroupWithAttrList.map((attrGroup, i) => {
                                  if (attrGroupIndex === i) {
                                    return {
                                      ...attrGroup,
                                      specAttrs: attrGroup.specAttrs.map((attr, j) => {
                                        if (specAttrIndex === j) {
                                          return {...attr, _customValue: e.target.checked}
                                        }
                                        return attr;
                                      })
                                    }
                                  }
                                  return attrGroup;
                                })
                              )
                            }}
                          >
                            Custom Value
                          </Checkbox>
                        </Form.Item>

                      </Space>
                    )
                  })
                }
              </div>
            )
          })}
        </Form>
      </div>
    )
  }
  const SkuForm = ({form}) => {
    const attrIdToName = {}; // {attrId: attrName}
    for (const attrGroup of attrGroupWithAttrList) {
      for (const attr of attrGroup.saleAttrs) {
        attrIdToName[attr.id] = attr.name;
      }
    }
    // TODO: 如果saleAttrs是空的，只显示一个（目前报错）
    const columns = [
      ...Object.keys(skuList[0].attrs).map((attrId, index) => {
        return {
          title: attrIdToName[attrId],
          dataIndex: ['attrs', attrId],
          key: uuidv4(),
        }
      }),
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Title',
        dataIndex: 'title',
        key: 'title',
      }
    ]
    useEffect(() => {
      const newFormSkuList = {};
      skuList.forEach((sku, index) => {
        const attrCombination = JSON.stringify(sku.attrs);
        if (form.getFieldValue(['skuList', attrCombination]) === undefined) {
          newFormSkuList[attrCombination] = {...sku};
        } else {
          newFormSkuList[attrCombination] = {...form.getFieldValue(['skuList', attrCombination])};
        }
      })
      form.setFieldValue('skuList', newFormSkuList);
    }, [])
    const [imageFileList, setImageFileList] = useState([]);
    return (
      <div>
        <Form form={form}
        >
          <Collapse defaultActiveKey={['1', '2']}>
            <Collapse.Panel header="Add Sku Images" key="1">
              {MyFormItem.Upload.MultiImage({
                name: 'skuImages',
                onChange: (fileList) => {
                  // form.setFieldValue('skuImages Changed', fileList);
                  // setImageFileList(fileList);
                }
              })}
            </Collapse.Panel>
            <Collapse.Panel header="Sku information" key="2">
              <Form.Item noStyle={true}>
                <Table
                  columns={columns}
                  dataSource={
                    skuList.map((sku, index) => {
                      return {
                        ...sku,
                        key: index,
                        _attrCombination: JSON.stringify(sku.attrs)
                      }
                    })
                  }
                  expandable={{
                    expandedRowRender: (record) => {
                      console.log('record', record)
                      return (
                        <Form.Item noStyle={true}>
                          <Row gutter={10}>
                            <Col span={5}>
                              <Form.Item
                                name={['skuList', record._attrCombination, 'name']}
                                label="Name"
                                // rules={[{required: true, message: 'Please input name'}]}
                              >
                                <Input.TextArea autoSize={{minRows: 1, maxRows: 3}}/>
                              </Form.Item>

                            </Col>
                            <Col span={8}>
                              <Form.Item
                                name={['skuList', record._attrCombination, 'title']}
                                label="Title"
                                // rules={[{required: true, message: 'Please input title'}]}
                              >
                                <Input.TextArea autoSize={{minRows: 1, maxRows: 3}}/>
                              </Form.Item>
                            </Col>
                            <Col span={10}>
                              <Form.Item
                                name={['skuList', record._attrCombination, 'subTitle']}
                                label="Sub-Title"
                                // rules={[{required: true, message: 'Please input subTitle'}]}
                              >
                                <Input.TextArea autoSize={{minRows: 1, maxRows: 3}}/>
                              </Form.Item>
                            </Col>
                          </Row>

                          <Row gutter={10}>
                            <Col span={5}>
                              <Form.Item
                                name={['skuList', record._attrCombination, 'price']}
                                label="Price $"
                                // rules={[{required: true, message: 'Please input price'}]}
                              >
                                <InputNumber
                                  min={0}
                                  precision={2}
                                  step={0.01}
                                />
                              </Form.Item>
                            </Col>
                            <Col span={8}>
                              <Form.Item
                                name={['skuList', record._attrCombination, 'gift card bonus']}
                                label="Gift Card Bonus $"
                                // rules={[{required: true, message: 'Please input gift card bonus'}]}
                              >
                                <InputNumber
                                  min={0}
                                  precision={0}
                                />
                              </Form.Item>
                            </Col>
                            <Col span={8}>
                              <Form.Item
                                name={['skuList', record._attrCombination, 'prime discount']}
                                label='Prime Discount %'
                                // rules={[{required: true, message: 'Please input prime discount'}]}
                              >
                                <InputNumber
                                  min={0}
                                  precision={0}
                                />
                              </Form.Item>
                            </Col>
                          </Row>
                          <Form.Item
                            name={['skuList', record._attrCombination, 'description']}
                            label="Description"
                            // rules={[{required: true, message: 'Please input description'}]}
                          >
                            <Input.TextArea
                              autoSize={{minRows: 1, maxRows: 5}}
                              style={{width: 'min(1000px, 100%)'}}
                            />
                          </Form.Item>
                          <Form.Item
                            name={['skuList', record._attrCombination, 'images']}
                            label="Images"
                            // rules={[{required: true, message: 'Please input images'}]}
                            shouldUpdate={(prevValues, currentValues) => {
                              // console.log('shouldUpdate', prevValues, currentValues, JSON.stringify(prevValues) !== JSON.stringify(currentValues))
                              setTimeout(() => { // NOTE 必须设置延迟， 图片上传有多个阶段， 每次form的值都会变化， 不设置延迟可能导致image显示不更新
                                setImageFileList(currentValues.skuImages);
                              }, 1000)
                            }}
                          >
                            <Checkbox.Group>
                              {
                                form.getFieldValue('skuImages')?.map((uploaderData, index) => {
                                  // console.log('uploaderData', uploaderData)
                                  return (
                                    <Checkbox
                                      value={uploaderData.uid} key={index}
                                    >
                                      <Image
                                        src={uploaderData.thumbUrl}
                                        alt={uploaderData.uid}
                                        style={{width: '100px', height: '100px'}}
                                        key={uploaderData.thumbUrl}  // NOTE: key，必须用thumbUrl, 添加图片的时候， 不会更新， key的更新会强制加载
                                      />
                                    </Checkbox>
                                  )
                                })
                              }
                            </Checkbox.Group>
                          </Form.Item>
                        </Form.Item>
                      )
                    }
                  }}
                />
              </Form.Item>
            </Collapse.Panel>

          </Collapse>


        </Form>
      </div>
    )
  }
  const steps = [
    {
      title: 'Basic Information',
      content: <BasicInfoForm form={basicInfoForm}/>,
    },
    {
      title: 'Specification Attribute',
      content: <SpecAttrForm form={specAttrForm}/>,
    },
    {
      title: 'Sale-related Attribute',
      content: <SaleAttrForm form={saleAttrForm}/>,
    },
    {
      title: 'SKU Information',
      content: <SkuForm form={skuForm}/>,
    }
  ]
  return (
    <div>
      <MySteps
        current={current}
        setCurrent={setCurrent}
        steps={steps}
        beforeNextStep={onClickNextStep}
      >
        {steps[current].content}
      </MySteps>
    </div>
  )
}

export default Publish;
