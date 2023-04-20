import React, {useEffect, useMemo, useState} from 'react';
import {useModel} from "@/.umi/exports";
import dbmsProduct from "@/services/dbms-product";
import {
  Affix,
  Avatar, Button,
  Card, Checkbox,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  List, message,
  Modal,
  Radio,
  Row,
  Select,
  Space,
  Tag,
  Typography
} from "antd";
import dbmsMember from "@/services/dbms-member";
import {history, useLocation} from "umi";
import {EditOutlined} from "@ant-design/icons";
import MyImage from "@/components/DataDisplay/MyImage";
import dbmsOrder from "@/services/dbms-order";

const skuService = dbmsProduct.skuController
const memberService = dbmsMember.memberController
const EditForm = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const {userInfo} = useModel('ecommerceFront')
  const [form] = Form.useForm();
  const [counties, setCounties] = useState([])
  const [states, setStates] = useState([])
  const [cities, setCities] = useState([])
  const selectedCountryId = Form.useWatch(['countryId'], form)
  const selectedStateId = Form.useWatch(['stateId'], form)

  useEffect(() => {
    countryService.getAll({}).then(res => {
      setCounties(res.data)

      form.setFieldsValue(initialData)
    })
  }, [])

  useEffect(() => {
    if (selectedCountryId) {
      countryService
      .getAllStates({id: selectedCountryId})
      .then(res => {
        setStates(res.data)
      })
    } else {
      setStates([])
    }
  }, [selectedCountryId])

  useEffect(() => {
    if (selectedStateId) {

      statesService
      .getAllCities({id: selectedStateId})
      .then(res => {
        setCities(res.data)
      })
    }
  }, [selectedStateId])

  const onFormSubmit = async () => {
    const data = await form.validateFields()
    data.city = cities.find(city => city.id === data.cityId).name
    data.state = states.find(state => state.id === data.stateId).name
    data.country = counties.find(country => country.id === data.countryId).name
    data.countryCode = counties.find(country => country.id === data.countryId).iso3
    data.stateCode = states.find(state => state.id === data.stateId).iso2

    onSubmit(data)
  }

  return (
    <Modal open={true} title={"Edit Your Shipping Address"} okText="Submit" cancelText="Cancel" onCancel={() => {
      onCancel()
    }}
           onOk={() => onFormSubmit()}
    >
      <Form form={form} layout="vertical" name="form_in_modal">
        <Form.Item name="name" label="Full Name" rules={[{required: true, message: 'Please input your full name!'}]}>
          <Input/>
        </Form.Item>
        <Form.Item name="countryId" label="Country" rules={[{required: true, message: 'Please input your country!'}]}>
          <Select showSearch placeholder="Select a country"
                  options={counties}
                  fieldNames={{label: 'name', value: 'id'}}
                  optionFilterProp={'name'}
          />
        </Form.Item>
        <Form.Item name="stateId" label="State/Province/Region"
                   rules={[{required: true, message: 'Please input your state/province/region!'}]}>
          <Select showSearch placeholder="Select a state/province/region"
                  options={states}
                  fieldNames={{label: 'name', value: 'id'}}
                  optionFilterProp={'name'}
          />
        </Form.Item>
        <Form.Item name="cityId" label="City" rules={[{required: true, message: 'Please input your city!'}]}>
          <Select showSearch placeholder="Select a city"
                  options={cities}
                  fieldNames={{label: 'name', value: 'id'}}
                  optionFilterProp={'name'}
          />
        </Form.Item>
        <Form.Item name="postcode" label="Postcode" rules={[{required: true, message: 'Please input your postcode!'}]}>
          <Input/>
        </Form.Item>
        <Form.Item name="address" label="Address" rules={[{required: true, message: 'Please input your address!'}]}>
          <Input/>
        </Form.Item>
        <Form.Item name="tele" label="Phone Number"
                   rules={[{required: true, message: 'Please input your phone number!'}]}
        >
          <InputNumber
            style={{width: '100%'}}
            prefix={`+(${counties.find(country => country.id === selectedCountryId)?.phonecode})`}
            stringMode
            maxLength={15}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

function CheckOut(props) {
  const location = useLocation()

  const {checkOutSkus=[], orderUUID} = location.state ?? {}
  useEffect(() => {
    if (!checkOutSkus || !orderUUID) {
      history.push('/ecommerce/front/cart')
    }
  }, [])
  const {cart, cartLoading, fetchCart,
    // checkOutSkus, setCheckOutSkus
  } = useModel('ecommerceFront');
  const [updateToDateCheckOutSkus, setUpdateToDateCheckOutSkus] = useState([])
  const [shippingAddressList, setShippingAddressList] = useState([])
  const {userInfo, userLoading} = useModel('ecommerceFront');
  const [selectedShippingAddressIndex, setSelectedShippingAddressIndex] = useState(0)
  const [selectedShippingTime, setSelectedShippingTime] = useState(30)

  const fetchSkus = async () => {
    const ids = checkOutSkus.map(item => item.skuId).join(',')
    const res = await skuService.getAll({
      ids,
    })
    const skuIdToSku = {}
    res.data.forEach(sku => {
      skuIdToSku[sku.id] = sku
    })
    let stockNotEnough = false
    const newCheckOutSkus = checkOutSkus.map(item => {
      if (item.quantity > skuIdToSku[item.skuId].stock) {
        item.quantity = skuIdToSku[item.skuId].stock
        stockNotEnough = true
      }
      return {
        ...item,
        newSku: skuIdToSku[item.skuId],
      }
    })
    if (stockNotEnough) {
      message.warning('Quantities of some items in your cart have been changed due to stock not enough.')
    }
    setUpdateToDateCheckOutSkus(newCheckOutSkus)
  }
  const fetchShippingAddress = async () => {

    const res = await memberService.pageAddress({
      username: userInfo.username,
      params: {
        current: 1,
        pageSize: 100,
      }
    })

    setShippingAddressList(res.data.list)
  }
  useEffect(() => {
    if (checkOutSkus?.length === 0) { // 购物车页面跳转必须>0, 并且return中在组件销毁时设置为了[], 如果=0，证明是其他方式跳转
      history.push('/ecommerce/front/cart')
    }

    fetchSkus()
    fetchShippingAddress()
  }, [])
  const ShippingAddress = () => {
    return <Row>
      {
        shippingAddressList.map((item, index) => {
          return (
            <Col key={index}>
              <Card
                style={{
                  width: 300,
                  margin: 16,
                  border: index === selectedShippingAddressIndex ? '2px solid #1890ff' : '1px solid #d9d9d9',
                }}
                onClick={() => {
                  setSelectedShippingAddressIndex(index)
                }}
              >
                <Typography.Paragraph style={{fontSize: 14, fontWeight: 500, marginBottom: 0,}}
                >{item.name}, {item.tele}</Typography.Paragraph>
                <Typography.Paragraph style={{fontSize: 14, fontWeight: 500, marginBottom: 0,}}
                >{item.address}</Typography.Paragraph>
                <Typography.Paragraph style={{fontSize: 14, fontWeight: 500, marginBottom: 0,}}
                >{item.countryCode}, {item.stateCode}, {item.city}, {item.postcode}</Typography.Paragraph>

              </Card>
            </Col>
          )
        })
      }
    </Row>
  }
  const CheckOutSkuList = () => {
    return <div>
      {
        updateToDateCheckOutSkus.map((item, index) => {
          return <Card key={index}
                       style={{
                         marginTop: 16,
                         boxShadow: '0 0 10px 0 rgba(0,0,0,0.1)',
                       }}
          >
            <Row className={'ant-row-no-newline'}
                 style={{
                   // alignItems: 'center',
                   maxWidth: 500,
                   minWidth: 400,
                 }}
            >
              <Col style={{width: 100, marginRight: 30}}>
                <span
                  style={{
                    display: 'inline-block',
                    padding: 8,
                    border: '1px solid #d9d9d9',
                    borderColor: '#ececec',
                    borderRadius: 10,
                    width: 100,
                    height: 100,
                  }}
                >
                  <MyImage.FitSize url={item.sku.skuImages[0].img}/>
                </span>
              </Col>
              <Col>
                <Row>
                  <Typography.Title level={5}
                                    style={{
                                      marginBottom: 0,
                                      marginTop: 0,
                                    }}
                                    ellipsis={{
                                      rows: 4,
                                    }}
                  >
                    {item.sku.name}
                  </Typography.Title>
                </Row>
                <Row>
                  <Typography.Text
                    type={item.sku.stock > 10 ? 'success' : item.sku.stock > 0 ? 'warning' : 'danger'}
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      // color: item.sku.stock > 10 ? 'green' : item.sku.stock > 0 ? 'orange' : 'red',
                    }}>
                    {
                      item.sku.stock > 10 ? 'In Stock'
                        : item.sku.stock > 0 ? 'Only ' + item.sku.stock + ' left in stock'
                          : 'Out of Stock'
                    }
                  </Typography.Text>
                </Row>
                <span>
                  {
                    item?.sku?.finalPrice && item.sku.finalPrice === item.sku.price && <Typography.Text
                      style={{
                        fontSize: 11,
                        fontWeight: 400,
                        color: '#a9a9a9',
                      }}
                      delete={true}
                    >
                      ${item.sku.price.toFixed(2)}
                    </Typography.Text>
                  }
                  <Typography.Text style={{fontWeight: 700}}>${item.sku.finalPrice.toFixed(2)}</Typography.Text>
                </span>

                <Row
                  style={{
                    alignItems: 'center',
                  }}
                >
                  <Col>
                    <Typography.Text style={{
                      fontSize: 16,
                      fontWeight: 700,
                    }}>
                      Qty: {item.quantity}
                      {/*<InputNumber*/}
                      {/*  style={{marginLeft: 10, width: 70}}*/}
                      {/*  size={'small'}*/}
                      {/*  min={1}*/}
                      {/*  max={item.sku.stock}*/}
                      {/*  precision={0}*/}
                      {/*  defaultValue={item.quantity}*/}
                      {/*  onChange={value => {*/}
                      {/*    // TODO: check stock when change quantity(even when reducing)*/}
                      {/*    const newDetailedCartList = [...updateToDateCheckOutSkus]*/}
                      {/*    newDetailedCartList[index].quantity = value*/}
                      {/*    setUpdateToDateCheckOutSkus(newDetailedCartList)*/}
                      {/*  }}*/}
                      {/*/>*/}
                    </Typography.Text>
                  </Col>
                </Row>
              </Col>
              {/*<Divider type={'vertical'} style={{height: '150px',}}/>*/}
              <Col flex={'auto'}/>
            </Row>
          </Card>
        })
      }
    </div>
  }
  const subTotal = useMemo(() => {
    const res = updateToDateCheckOutSkus.reduce((acc, item) => {
      acc.originalPrice += item.sku.price * item.quantity
      acc.price += item.sku.price * item.quantity * (1 - (item.sku.primeDiscount ?? 0) / 100)
      acc.count += item.quantity
      return acc
    }, {price: 0, count: 0, originalPrice: 0})
    res.price = res.price.toFixed(2)
    return res
  }, [updateToDateCheckOutSkus])
  const onClickPlaceOrder = () => {

    if (!shippingAddressList || shippingAddressList.length === 0) {
      message.warning('Please add shipping address')
      return
    }
    const orderService = dbmsOrder.orderController
    const selectAddress = shippingAddressList[selectedShippingAddressIndex]

    const body = {
      memberId: userInfo.id,
      username: userInfo.username,
      orderUUID: orderUUID, // TODO
      shippingName: selectAddress.name,
      shippingPhone: selectAddress.tele,
      shippingPostcode: selectAddress.postcode,
      shippingState: selectAddress.state,
      shippingCity: selectAddress.city,
      shippingCountry: selectAddress.country,
      shippingAddress: selectAddress.address,
      originalTotalPrice: subTotal.originalPrice,
      finalTotalPrice: subTotal.price,
      shippingTime: selectedShippingTime,
      paymentCardNumber: "4242 4242 4242 4242",
      paymentMethod: "credit-card",

      note: "",
      skus: updateToDateCheckOutSkus.map(item => {
        return {
          skuId: item.sku.id,
          skuName: item.sku.name,
          skuQuantity: item.quantity,
          skuImg: item.sku.skuImages[0].img,
          skuOriginalPrice: item.sku.price,
          skuFinalPrice: item.sku.finalPrice,
        }
      })
    }

    orderService.placeOrder(body).then(
      res => {
        message.success('Place order successfully')
        history.push('/ecommerce/front/account/order')
      },
    )
  }
  return (
    <div>
      <Row className={'ant-row-no-newline'}
           style={{
             // alignItems: 'center',
             justifyContent: 'center',
             marginTop: 16,
           }}
      >
        <Col>
          <Typography.Title level={4} style={{marginBottom: 0,}}>
            Shipping address
            <a onClick={e => {
              history.replace('/ecommerce/front/account/address')
            }}>
              <Typography.Text style={{fontSize: 14, marginLeft: 8, color: '#1890ff'}}>
                <EditOutlined/>
              </Typography.Text>
            </a>
          </Typography.Title>
          <ShippingAddress/>
          <Divider style={{marginBottom: 15, marginTop: 15}}/>
          <Row>

            <Typography.Title level={4} style={{marginBottom: 15, marginTop: 0}}>
              Payment method
              <Tag style={{fontSize: 14, marginLeft: 18, fontWeight: 400}}>
                Master 4242 4242 4242 4242
              </Tag>
            </Typography.Title>

          </Row>
          <Divider style={{marginBottom: 15, marginTop: 15}}/>

          <Typography.Title level={4} style={{marginBottom: 15, marginTop: 0}}>
            Shipping method
          </Typography.Title>
          <Radio.Group
            value={selectedShippingTime}
            onChange={e => {

              setSelectedShippingTime(e.target.value)
            }}
          >
            <Radio value={30}>30 seconds</Radio>
            <Radio value={60}>1 minute</Radio>
            <Radio value={120}>2 minute</Radio>
            <Radio value={240}>2 minute</Radio>
          </Radio.Group>
          <Divider style={{marginBottom: 15, marginTop: 15}}/>

          <Row>
            <Typography.Title level={4} style={{marginBottom: 0, marginTop: 0}}>
              Review items
            </Typography.Title>
          </Row>
          <Row>
            <CheckOutSkuList/>
          </Row>
        </Col>
        <Col
          style={{
            marginLeft: 20,
            marginRight: 20,
          }}
        >
          <Affix
            offsetTop={50}
          >
            <div
              style={{
                backgroundColor: '#ffffff',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 10,
                boxShadow: '0 0 10px 0 rgba(0,0,0,0.1)',
              }}
            >
              <Row
                style={{

                  paddingTop: 20,
                  paddingBottom: 10,
                  paddingLeft: 20,
                  paddingRight: 20,
                }}
              >
                <Col>
                  <Row>
                    <Typography.Text style={{fontSize: 18, marginLeft: 8, fontWeight: 600}}>
                      Subtotal ({subTotal.count} items):
                    </Typography.Text>
                    <Typography.Text style={{fontSize: 18, marginLeft: 8, fontWeight: 600}}>
                      ${subTotal.price}
                    </Typography.Text>
                  </Row>
                </Col>
              </Row>
              <Row
                style={{
                  paddingLeft: 20,
                  paddingRight: 20,
                  paddingBottom: 20,
                }}
              >
                <Button
                  type={'primary'}
                  style={{
                    width: '100%',
                  }}
                  onClick={onClickPlaceOrder}
                >
                  Place the order
                </Button>
              </Row>
            </div>
          </Affix>
        </Col>
      </Row>
    </div>
  );
}

export default CheckOut;
