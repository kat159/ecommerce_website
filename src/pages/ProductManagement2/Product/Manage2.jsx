import React, {useEffect, useMemo, useState} from 'react';
import {v4 as uuid} from 'uuid';
import dbmsProduct from "@/services/dbms-product";
import constant from "@/utils/constant";
import {
  Breadcrumb,
  Button,
  Checkbox,
  Col, Collapse,
  Divider,
  Form, Image, Input, InputNumber,
  Pagination, Popconfirm,
  Radio,
  Row,
  Select,
  Space,
  Steps,
  Table,
  Tag
} from "antd";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";
import {useForm} from "antd/es/form/Form";
import MyFormItem from "@/components/RelationalCRUD3/MyFormItem";
import MyDataEntry from "@/components/RelationalCRUD3/MyDataEntry";
import {uploadFile} from "@/services/swagger/pet";
import {isEqual} from "lodash";
import googleCloudStorage from "@/services/third-party-service/googleCloudStorage";
import DeleteConfirm from "@/components/PopConfirm/DeleteConfirm";

const categoryService = dbmsProduct.categoryController;
const brandService = dbmsProduct.brandController;
const productService = dbmsProduct.productController;
const skuImageService = dbmsProduct.skuImageController;
const skuSkuImageService = dbmsProduct.skuSkuImageController;
const skuService = dbmsProduct.skuController;

function Manage(props) {
  const [tableData, setTableData] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  useEffect(() => {
    fetchProductPage({current: 1, pageSize: 10});
    // setInterval(() => {
    //   setPagination({})
    // }, 1000)
  }, [])
  const fetchProductPage = async ({current, pageSize}) => {
    const productPageData = await productService.page({
      [constant.CURRENT_PAGE_STR]: current,
      [constant.PAGE_SIZE_STR]: pageSize,
      [constant.INCLUDE]: ['sku', 'attr', 'image'].join(','),
    })
    const {list, ...newPagination} = productPageData.data;

    setPagination({...pagination, ...newPagination})
    setTableData(list)
  }
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 1000,
    onChange: (current, pageSize) => {
      fetchProductPage({current, pageSize})
    }
  })
  const ProductTable = () => {
    const onClickEditProduct = (product) => {

      setEditingProduct(product)
    }
    const onClickDeleteProduct = (product) => {
      productService.removeAll([product.id]).then(() => {
        fetchProductPage(pagination)
      })
    }
    const columns = [
      {
        title: 'Product Name',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Image',
        dataIndex: 'images',
        key: 'images',
        render: (images) => {
          const defaultImage = images.find((image) => image.isDefault) || images[0]
          if (!defaultImage) {
            return null
          }
          return (
            <div>
              <img src={defaultImage.url} alt={defaultImage.name} style={{height: 50}}/>
            </div>
          )
        }
      },
      {
        title: 'Product Status',
        dataIndex: 'publishStatus',
        render: (publishStatus) => publishStatus === 1 ? <Tag color="green">On List</Tag> : <Tag>Unlisted</Tag>,
        key: 'status',
      },
      {
        title: 'Sku',
        dataIndex: 'skus',
        key: 'skus',
        render: (skus) => {
          return <span>
            {
              skus?.map((sku, index) => {
                return index <= 2 && <div key={index}>{sku.name}</div>
              })
            }
            {
              skus?.length > 3 && <div>
                {skus.length - 3} more sku...
              </div>
            }
          </span>
        }
      },
      {
        title: 'Category',
        dataIndex: 'categoryName',
        key: 'categoryName',
      },
      {
        title: 'Brand',
        dataIndex: 'brandName',
        key: 'brandName',
      },
      {
        title: 'Total Sales',
        dataIndex: 'skus',
        key: 'salesCount',
        render: (sku) => {
          return sku.reduce((count, sku) => count + (sku.salesCount ?? 0), 0)
        }
      },
      {
        title: 'Action',
        key: 'action',
        render: (text, record) => (
          <Space size="middle">
            <EditOutlined className={'my-click-icon'} onClick={() => onClickEditProduct(record)}/>
            <Popconfirm title={'Are you sure to delete this product?'} onConfirm={() => onClickDeleteProduct(record)}>
              <DeleteOutlined className={'my-click-icon'}/>
            </Popconfirm>
            {/*<DeleteOutlined className={'my-click-icon'} onClick={() => onClickDeleteProduct(record)}/>*/}
          </Space>
        )
      }
    ]
    return (
      <div>
        <Table
          size={'small'}
          columns={columns}
          dataSource={
            tableData.map((product) => {
              return {
                ...product,
                publishStatus: product.publishStatus === 1 ? 1 : 0,
                key: product.id,
              }
            })
          }
          pagination={pagination}
        />
      </div>
    )
  }
  const ProductEditPage = () => {
    const [currentStep, setCurrentStep] = useState(0)
    const [customAttrIdMap, setCustomAttrIdMap] = useState({})
    const initProductInfo = structuredClone(editingProduct)

    const initBasicInfo = {
      name: initProductInfo.name,
      publishStatus: initProductInfo.publishStatus,
      images: initProductInfo.images.map(image => {
        return {
          uid: image.id,
          url: image.url,
          status: 'done',
        }
      }),
      description: initProductInfo.description,
    }
    const initAttrIdToValueMap = initProductInfo.productAttributeValues.reduce((map, attrValue) => {
      map[attrValue.attributeId] = attrValue.attributeValue
      return map
    }, {})
    const initSkuImages = structuredClone(initProductInfo.skuImages.map(skuImage => {
        return {
          uid: skuImage.id,
          url: skuImage.img,
          status: 'done',
        }
      })
    )
    const initSkus = structuredClone(initProductInfo.skus)
    const initialProductInfo = {
      basicInfo: structuredClone(initBasicInfo),
      attrIdToValueMap: structuredClone(initAttrIdToValueMap),
      skuImages: structuredClone(initSkuImages),
      skus: structuredClone(initSkus),
    }
    const [aggregateFormData, setAggregateFormData] = useState({
      basicInfo: structuredClone(initBasicInfo),
      attrIdToValueMap: structuredClone(initAttrIdToValueMap),
      skuImages: structuredClone(initSkuImages),
      skus: structuredClone(initSkus),
    })
    const [form] = Form.useForm()
    const onClickSave = async () => {
      const preData = initialProductInfo;
      const curData = await getNewAggregateFormData();
      let toUpdate = {id: initProductInfo.id}

      const checkProductInfo = async () => {
        const {images: productImages, ...productInfo} = curData.basicInfo
        const {images: preProductImages, ...preProductInfo} = preData.basicInfo
        if (!isEqual(productInfo, preProductInfo)) {

          toUpdate.productToUpdate = productInfo
        } else {

        }
        if (!isEqual(productImages, preProductImages)) {

          const preImageIdsSet = new Set(preProductImages.map(image => image.uid))
          const newImageIdsSet = new Set(productImages.map(image => image.uid))
          const deletedImages = preProductImages.filter(image => !newImageIdsSet.has(image.uid))
          const deletedImageUrls = deletedImages.map(image => image.url)
          googleCloudStorage.deleteAllFile(deletedImageUrls) // 删除不等
          toUpdate.productImageIdsToDelete = deletedImages.map(image => image.uid)  //
          const newImages = productImages.filter(image => !preImageIdsSet.has(image.uid)).map(image => image.originFileObj)
          const downLoadUrls = await googleCloudStorage.addAllProductImages(newImages, constant.FILE)
          toUpdate.productImagesToAdd = downLoadUrls.map((url, index) => {
            return {
              url,
              // sort: index,
            }
          })
        } else {

        }
      }
      const checkAttrIdToValueMap = async () => {
        const {attrIdToValueMap} = curData
        const preAttrValues = initProductInfo.productAttributeValues;
        const curAttrValues = preAttrValues.map(attrValue => {
          return {
            ...attrValue,
            attributeValue: attrIdToValueMap[attrValue.attributeId] ?? attrValue.attributeValue,
          }
        })
        const changedAttrValues = curAttrValues.filter(attrValue => !isEqual(attrValue, preAttrValues.find(preAttrValue => preAttrValue.id === attrValue.id)))
        if (!isEqual(curAttrValues, preAttrValues)) {

          toUpdate.productAttrValuesToUpdate = changedAttrValues
        } else {

        }
      }

      const imageTmpIdToIdMap = {}
      const saveSkuImages = async () => {
        const preSkuImages = preData.skuImages;
        const curSkuImages = curData.skuImages
        if (!isEqual(curSkuImages, preSkuImages)) {

          const preImageIdsSet = new Set(preSkuImages.map(image => image.uid))
          const curImageIdsSet = new Set(curSkuImages.map(image => image.uid))
          const deletedImages = preSkuImages.filter(image => !curImageIdsSet.has(image.uid))
          const deletedImageUrls = deletedImages.map(image => image.url)
          googleCloudStorage.deleteAllFile(deletedImageUrls) // 删除不等
          skuImageService.removeAll(deletedImages.map(image => image.uid))
          // toUpdate.skuImageIdsToDelete = deletedImages.map(image => image.uid)  //
          const newImages = curSkuImages.filter(image => !preImageIdsSet.has(image.uid)).map(image => image.originFileObj)
          const downLoadUrls = await googleCloudStorage.addAllProductImages(newImages, constant.FILE)
          const imageIds = (await skuImageService.addAll(downLoadUrls.map(url => {
            return {
              img: url,
              productId: initProductInfo.id,
            }
          }))).data

          for (let i = 0; i < imageIds.length; i++) {
            imageTmpIdToIdMap[newImages[i].uid] = imageIds[i]
          }
          const deletedImageIds = deletedImages.map(image => image.uid)
          for (const sku of curData.skus) {
            const toAddSkuImageUidList = []
            for (const uid of sku.skuImageUidList) {
              if (deletedImageIds.includes(uid)) {
                continue
              } else if (imageTmpIdToIdMap[uid]) {
                toAddSkuImageUidList.push(imageTmpIdToIdMap[uid])
              } else {
                // newSkuImageUidList.push(uid)
                continue
              }
            }
            await skuSkuImageService.addAll(toAddSkuImageUidList.map(skuImageId => {
              return {
                skuId: sku.id,
                skuImageId,
              }
            }))
          }
        } else {

        }
      }
      const saveSkuInfo = async () => {
        const preSkus = preData.skus;
        const curSkus = curData.skus

        const preSkuIdToSkuMap = preSkus.reduce((map, sku) => {
          map[sku.id] = sku
          return map
        }, {})
        const curSkuIdToSkuMap = curSkus.reduce((map, sku) => {
          map[sku.id] = sku
          return map
        }, {})
        const skuIdsToDelete = preSkus.filter(sku => !curSkuIdToSkuMap[sku.id]).map(sku => sku.id)
        // const skuIdsToAdd = curSkus.filter(sku => !preSkuIdToSkuMap[sku.id]).map(sku => sku.id)
        const skuIdsToUpdate = curSkus.filter(sku => preSkuIdToSkuMap[sku.id]).map(sku => sku.id)
        if (skuIdsToDelete.length > 0) {
          await skuService.removeAll(skuIdsToDelete)
        }
        if (skuIdsToUpdate.length > 0) {
          const skuListToUpdate = skuIdsToUpdate.map(skuId => {
            const sku = curSkuIdToSkuMap[skuId]
            const {id, name, price, subtitle, title, description, stock, primeDiscount} = sku
            return {id, name, price, subtitle, title, description, stock, primeDiscount}
          })

          await skuService.updateAll(skuListToUpdate)
        }
      }
      await checkProductInfo()
      await checkAttrIdToValueMap()
      await saveSkuImages()
      await saveSkuInfo()
      await productService.manageAll([toUpdate])
      await fetchProductPage(pagination)
      setEditingProduct(null)
    }
    const getNewAggregateFormData = async () => {
      if (currentStep === 0) {
        const basicInfo = await form.validateFields()

        return {...aggregateFormData, basicInfo}
      } else if (currentStep === 1) {
        const attrIdToValueMap = await form.validateFields()

        return {...aggregateFormData, attrIdToValueMap}
      } else if (currentStep === 2) {
        const {skuImages, skus} = await form.validateFields()

        return {...aggregateFormData, skuImages, skus}
      }

      return aggregateFormData
    }
    const onStepChange = async (nextStep) => {

      const newAggregateFormData = await getNewAggregateFormData()

      setAggregateFormData(newAggregateFormData)
      setCurrentStep(nextStep)
    }
    const BasicInfoForm = () => {
      useEffect(() => {
        form.setFieldsValue(structuredClone(aggregateFormData.basicInfo))
      }, [])
      return (
        <Form
          form={form}
        >
          {MyFormItem.Input.Text({label: "Product Name", name: "name"})}
          <Form.Item
            label="Product Status"
            name="publishStatus"
            rules={[{required: true, message: 'Please select product status'}]}
          >
            <Radio.Group>
              <Radio value={1}>
                <Tag color="green">On List</Tag>
              </Radio>
              <Radio value={0}>
                <Tag>Unlisted</Tag>
              </Radio>
            </Radio.Group>
          </Form.Item>
          {MyFormItem.Input.TextArea({label: "Product Description", name: "description"})}
          {MyFormItem.Upload.MultiImage({
            label: 'Product Images',
            name: 'images',
          })}
        </Form>
      )
    }
    const SpecAttrForm = () => {
      useEffect(() => {
        form.setFieldsValue(structuredClone(aggregateFormData.attrIdToValueMap))
      }, [])
      return (
        <Form
          form={form}
        >
          {
            initProductInfo.attributeGroups.map((attrGroup, index) => {
              const {name: attrGroupName, attributes} = attrGroup
              const specAttrs = attributes.filter(attr => attr?.type === 1)
              if (specAttrs.length === 0) {
                return null
              }

              return (
                <div key={index}>
                  <Divider orientation={'left'}>{attrGroupName}</Divider>
                  {
                    specAttrs.map((attr, index) => {
                      const {selectableValueList, name, id} = attr
                      const values = [...selectableValueList]
                      return (
                        <Row
                          gutter={16}
                          key={index}
                        >
                          <Col span={12}>
                            <Form.Item
                              label={name}
                              name={id}
                            >
                              {!customAttrIdMap[id]
                                ? MyDataEntry.Select.Select({
                                  options: values.map(v => {
                                    return {value: v, label: v}
                                  }),
                                  style: {
                                    minWidth: '200px',
                                  }
                                })
                                : <Input.TextArea autoSize={{minRows: 1, maxRows: 6}}/>
                              }
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item>
                              <Checkbox
                                checked={customAttrIdMap[id]}
                                onChange={(e) => {

                                  setCustomAttrIdMap({...customAttrIdMap, [id]: e.target.checked})
                                }}
                              >
                                Custom Value
                              </Checkbox>
                            </Form.Item>
                          </Col>
                        </Row>
                      )
                    })
                  }
                </div>
              )
            })
          }
        </Form>
      )
    }
    const SkuInfoForm = () => {
      const [skuImageFileList, setSkuImageFileList] = useState(structuredClone(aggregateFormData.skuImages))
      const saleAttrIdToNameMap = initProductInfo.attributeGroups.reduce((map, attrGroup) => {
        const {name: attrGroupName, attributes} = attrGroup
        const saleAttrs = attributes.filter(attr => attr?.type === 0)
        saleAttrs.forEach(attr => {
          map[attr.id] = attr.name
        })
        return map
      }, {})
      const columns = [
        ...Object.keys(saleAttrIdToNameMap).map(attrId => {
          return {
            title: saleAttrIdToNameMap[attrId],
            dataIndex: ['saleAttrValueMap', attrId],
            key: uuid(),
          }
        }),
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
          render: (text, record, index) => {
            return (
              <Form.Item
                name={['skus', index, 'name']}
                rules={[{required: true, message: 'Please input sku name'}]}
                noStyle={true}
              >
                <Input/>
              </Form.Item>
            )
          }
        },
        {
          title: 'Price',
          dataIndex: 'price',
          key: 'price',
          render: (text, record, index) => {
            return <Form.Item
              name={['skus', index, 'price']}
              label="Price $"
              // rules={[{required: true, message: 'Please input price'}]}
              noStyle={true}
            >
              <InputNumber
                min={0}
                precision={2}
                step={0.01}
              />
            </Form.Item>
          }
        },
        {
          title: 'Stock',
          dataIndex: 'stock',
          key: 'stock',
          render: (text, record, index) => {
            return <Form.Item
              name={['skus', index, 'stock']}
              label="Stock"
              // rules={[{required: true, message: 'Please input stock'}]}
              noStyle={true}
            >
              <InputNumber
                min={0}
                precision={0}
                step={1}
              />
            </Form.Item>
          }
        },
        {
          title: 'discount %',
          dataIndex: 'primeDiscount',
          key: 'primeDiscount',
          render: (text, record, index) => {
            return <Form.Item
              name={['skus', index, 'primeDiscount']}
              label="Discount"
              // rules={[{required: true, message: 'Please input discount'}]}
              noStyle={true}
            >
              <InputNumber
                min={0}
                max={100}
                precision={2}
                step={0.01}
              />
            </Form.Item>
          }

        },
        {
          title: 'Action',
          key: 'action',
          render: (text, record, index) => (
            <Space size="middle">
              <a
                onClick={() => {
                  const newSkus = form.getFieldValue('skus').filter((sku, i) => i !== index)

                  form.setFieldsValue({skus: newSkus})
                }}
              >Delete</a>
            </Space>
          )
        }
      ]
      useEffect(() => {
        const skuData = structuredClone(aggregateFormData.skus).map(sku => {
          return {
            ...sku,
            saleAttrValueMap: sku.saleAttrValues.reduce((map, attrValue) => {
              map[attrValue.attributeId] = attrValue.attributeValue
              return map
            }, {}),
            skuImageUidList: sku.skuSkuImages.map(skuSkuImage => skuSkuImage.skuImageId)
          }
        })
        form.setFieldsValue({
          skuImages: structuredClone(aggregateFormData.skuImages),
          // skus: structuredClone(aggregateFormData.skus),
          skus: skuData,
        })
      }, [])
      return (
        <Form
          form={form}
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
              <Form.Item
                noStyle={true}
                shouldUpdate={true}
                name={'skus'} // *NOTE: Form.Item 只能包裹一个组件，这里包裹的是table，所以不可能会产生form的value， 只有form.item包括input这种组件才会产生value。这里只是通过name对table进行传值
                valuePropName={'dataSource'}
              >
                <Table
                  columns={columns}
                  // dataSource={form.getFieldValue('skus')}
                  pagination={false}
                  rowKey={'id'}
                  expandable={{
                    defaultExpandAllRows: true,
                    expandedRowRender: (record, index) => {

                      return (
                        <Form.Item noStyle={true}>
                          <Row gutter={10}>
                            {/*
                            <Col span={5}>
                              <Form.Item
                                name={['skus', index, 'name']}
                                label="Name"
                                // rules={[{required: true, message: 'Please input name'}]}
                              >
                                <Input.TextArea autoSize={{minRows: 1, maxRows: 3}}/>
                              </Form.Item>
                            </Col>
                            */}
                            <Col span={12}>
                              <Form.Item
                                name={['skus', index, 'title']}
                                label="Title"
                                // rules={[{required: true, message: 'Please input title'}]}
                              >
                                <Input.TextArea autoSize={{minRows: 1, maxRows: 3}}/>
                              </Form.Item>
                            </Col>
                            <Col span={12}>
                              <Form.Item
                                name={['skus', index, 'subtitle']}
                                label="Sub-Title"
                                // rules={[{required: true, message: 'Please input subtitle'}]}
                              >
                                <Input.TextArea autoSize={{minRows: 1, maxRows: 3}}/>
                              </Form.Item>
                            </Col>
                          </Row>
                          {/*
                          <Row gutter={10}>
                            <Col span={5}>
                              <Form.Item
                                name={['skus', index, 'price']}
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
                                name={['skus', index, 'giftCardBonus']}
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
                                name={['skus', index, 'primeDiscount']}
                                label='Prime Discount %'
                                // rules={[{required: true, message: 'Please input prime discount'}]}
                              >
                                <InputNumber
                                  min={0}
                                  max={100}
                                  precision={0}
                                />
                              </Form.Item>
                            </Col>
                          </Row>
                          */}
                          <Form.Item
                            name={['skus', index, 'description']}
                            label="Description"
                            // rules={[{required: true, message: 'Please input description'}]}
                          >
                            <Input.TextArea
                              autoSize={{minRows: 1, maxRows: 5}}
                              style={{width: 'min(1000px, 100%)'}}
                            />
                          </Form.Item>
                          <Form.Item
                            name={['skus', index, 'skuImageUidList']}
                            label="Images"
                            // rules={[{required: true, message: 'Please input images'}]}
                            shouldUpdate={(prevValues, currentValues) => {
                              const preImages = prevValues.skuImages[prevValues.skuImages.length - 1]
                              const currentImages = currentValues.skuImages[currentValues.skuImages.length - 1]
                              setTimeout(() => { // 所以只能用setTimeout，file不是promise，status=done的时候， thumbUrl是undefined， 而且thumbUrl是异步直接赋值传入，不知道怎么等待获取thumbUrl？
                                setSkuImageFileList(currentValues.skuImages)
                              }, 1000)
                            }}
                          >
                            <Checkbox.Group>
                              <Row gutter={10}>
                                {
                                  form.getFieldValue('skuImages')?.map((uploaderData, index) => {
                                    // skuImageFileList.map((uploaderData, index) => {
                                    const url = uploaderData.thumbUrl ?? uploaderData.url
                                    return (
                                      <Col key={index}>
                                        <Checkbox
                                          value={uploaderData.uid} key={index}
                                        >
                                          {/*<MyImage*/}
                                          {/*  src={uploaderData.thumbUrl ?? uploaderData.url}*/}
                                          {/*  alt={uploaderData.uid}*/}
                                          {/*  style={{*/}
                                          {/*    height: '100px',*/}
                                          {/*    padding: '5px',*/}
                                          {/*    margin: '5px',*/}
                                          {/*  }}*/}
                                          {/*  // key={uploaderData.thumbUrl ?? uploaderData.url}  // NOTE: key，必须用thumbUrl, 添加图片的时候， 不会更新， key的更新会强制加载*/}
                                          {/*  key={uuid()}*/}
                                          {/*/>*/}
                                          <div key={index} style={{
                                            width: '100px',
                                            height: '100px',
                                            margin: '10px',
                                            border: '1px solid #eee',
                                            borderRadius: '20px',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                          }}>
                                            <div style={{
                                              width: '100%',
                                              height: '100%',
                                              overflow: 'hidden',
                                              padding: '10px'
                                            }}>
                                              <img src={url} alt={`image-${index}`}
                                                   style={{width: '100%', height: '100%', objectFit: 'contain'}}/>
                                            </div>
                                          </div>
                                        </Checkbox>
                                        {/*<div key={index} style={{ width: '300px', height: '300px', margin: '10px', border: '1px solid #eee' }}>*/}
                                        {/*  <img src={url} alt={`image-${index}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />*/}
                                        {/*</div>*/}
                                      </Col>
                                    )
                                  })
                                }
                              </Row>
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
      )
    }
    return (
      <div>
        <Row>
          <Col flex>
            <Steps
              current={currentStep}
              onChange={onStepChange}
              items={[
                {
                  title: 'Basic Information',
                },
                {
                  title: 'Specification Attributes',
                },
                {
                  title: 'Sku Information',
                },
                {
                  title: 'Display Settings',
                }
              ]}
              direction={'vertical'}
              size={'small'}
            />
          </Col>
          <Col>
            <Divider type="vertical" style={{height: '100%'}}/>
          </Col>
          <Col flex={'1 1 500px'} style={{maxWidth: '1000px'}}>
            {
              currentStep === 0 ? <BasicInfoForm/>
                : currentStep === 1 ? <SpecAttrForm/>
                  : currentStep === 2 ? <SkuInfoForm/>
                    : <div>Display Settings</div>
            }
          </Col>
          <Space
            style={{
              position: 'fixed',
              bottom: '10%',
              // minBottom: '10%',
              display: 'flex',
            }}
          >
            <Button type={'primary'} onClick={() => setEditingProduct(null)}>Back</Button>
            <Button type={'primary'} onClick={() => {
              onClickSave()
            }}>Save</Button>
          </Space>

        </Row>

      </div>
    )
  }
  return (
    <div>
      {
        editingProduct ? <ProductEditPage/> : <ProductTable/>
      }
    </div>
  );
}

export default Manage;
