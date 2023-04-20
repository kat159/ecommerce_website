import React, {useEffect, useMemo, useState} from 'react';
import VirtualList from 'rc-virtual-list';
import {useModel, history} from "@/.umi/exports";
import dbmsProduct from "@/services/dbms-product";
import {
  Avatar,
  List,
  message,
  Button,
  Skeleton,
  Row,
  Col,
  Divider,
  Checkbox,
  Typography,
  Select,
  InputNumber, Spin, Affix
} from 'antd';
import MyImage from "@/components/DataDisplay/MyImage";
import dbmsMember from "@/services/dbms-member";
import dbmsOrder from "@/services/dbms-order";

const skuService = dbmsProduct.skuController
const cartService = dbmsMember.memberSkuCartController

function Cart(props) {

  return (
    <div>
      <CartItems/>
    </div>
  );
}

const count = 3;
const fakeDataUrl = `https://randomuser.me/api/?results=${count}&inc=name,gender,email,nat,picture&noinfo`;
const CartItems = () => {
    const {cart, cartLoading, fetchCart,
      checkOutSkus, setCheckOutSkus,
      checkoutOrderUUID, setCheckoutOrderUUID} = useModel('ecommerceFront');

    const [cartSkuList, setCartSkuList] = useState([])
    const [detailedCartList, setDetailedCartList] = useState([])
    useEffect(() => {
      skuService.getAll({
        ids: cart.map(item => item.skuId).join(','),
      }).then(res => {
        const skuIdToSku = {}
        res.data.forEach(sku => {
          skuIdToSku[sku.id] = sku
        })
        const delistedCartItemIds = cart.filter(item => !skuIdToSku[item.skuId]).map(item => item.id)
        if (delistedCartItemIds.length > 0) {
          message.warning(`${delistedCartItemIds.length} items in your cart are no longer available`)
          cartService.removeAll([...delistedCartItemIds]).then(res => {
            fetchCart()
          })
        }
        const newDetailedCartList = cart.filter(item => skuIdToSku[item.skuId]).map(item => {
          return {
            ...item,
            sku: skuIdToSku[item.skuId],
            _selected: true,
          }
        })

        setDetailedCartList(newDetailedCartList)
      })
    }, [])
    const onClickCheckout = async () => {
      const checkedSkuList = detailedCartList.filter(item => item._selected)
      if (checkedSkuList.length === 0) {
        message.error('Please select at least one item.')
        return
      }
      const orderService = dbmsOrder.orderController
      const res = await orderService.checkout({})
      setCheckoutOrderUUID(res.data.orderUUID)

      setCheckOutSkus(checkedSkuList)
      history.push('/ecommerce/front/check-out', {
        orderUUID: res.data.orderUUID,
        checkOutSkus: checkedSkuList,
      })
      // window.open('/ecommerce/front/check-out', '_blank')

    }
    // useEffect(() => {
    //   // click checkout button will set checkOutSkus
    //   //   then direct to checkout page
    //   //   checkout will set checkOutSkus to null when unmounted, so the only way to reach checkout page is from cart page
    //   if (checkOutSkus && checkOutSkus.length > 0) {
    //     history.push('/ecommerce/front/check-out', )
    //   }
    // }, [checkOutSkus])
    const subTotal = useMemo(() => {

      const res = detailedCartList.reduce((acc, item) => {
        acc.price += (item.sku?.finalPrice ?? 0) * (item.quantity ?? 0)
        acc.count += item.quantity ?? 0
        return acc
      }, {price: 0, count: 0})
      res.price = res.price.toFixed(2)
      return res
    }, [detailedCartList])
    return (
      <Row className={'ant-row-no-newline'}
           style={{
             // alignItems: 'center',
             justifyContent: 'center',
             marginTop: 16,
           }}
      >
        <Col flex={'auto'} style={{
          backgroundColor: 'white',
          padding: '0 20px',
          maxWidth: '1000px',
        }}
        >
          <Typography.Title level={3}>Shopping Cart</Typography.Title>
          <Divider/>
          {
            detailedCartList.map((item, index) => {
              return (
                item.sku && <div key={index}
                                 style={{}
                                   // item.sku.stock <= 4 ? {
                                   //   backgroundColor: '#f5f5f5',
                                   //   opacity: 0.5,
                                   // } : {}
                                 }
                >
                  <Row>
                    <Checkbox
                      checked={item.sku.stock > 0 && item._selected}
                      style={{alignItems: 'center', marginRight: 20}}
                      onClick={e => {
                        e.stopPropagation()
                        const newDetailedCartList = [...detailedCartList]
                        newDetailedCartList[index]._selected = !newDetailedCartList[index]._selected
                        setDetailedCartList(newDetailedCartList)
                      }}
                      disabled={item.sku.stock <= 0}
                    />
                    <Col style={{width: 150,}}>
                      <MyImage.FitSize url={item.sku.skuImages[0].img}/>
                    </Col>
                    <Divider type={'vertical'}
                             style={{
                               height: '150px', alignSelf: 'center',
                               margin: '0 20px',
                             }}
                    />
                    <Col>
                      <Row>
                        <Typography.Title level={5}
                                          style={{marginTop: 0,}}
                        >
                          {item.sku.name}
                        </Typography.Title>
                      </Row>
                      {
                        item.sku.saleAttrValues.map((attr, index) => {
                          return <Row key={index}>
                            <Typography.Text style={{
                              fontSize: 12,
                              fontWeight: 700,
                            }}>
                              {attr.attributeName}:
                            </Typography.Text>
                            <Typography.Text style={{
                              fontSize: 12,
                              fontWeight: 500,
                              marginLeft: 5,
                            }}>
                              {attr.attributeValue}
                            </Typography.Text>
                          </Row>
                        })
                      }
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
                      <Row
                        style={{
                          alignItems: 'center',
                          marginTop: '10px',
                        }}
                      >
                        <Col>
                          <Typography.Text style={{
                            fontSize: 16,
                            fontWeight: 700,
                          }}>
                            Qty:
                            <InputNumber
                              style={{marginLeft: 10, width: 70}}
                              size={'small'}
                              min={1}
                              max={item.sku.stock}
                              precision={0}
                              defaultValue={item.quantity}
                              onChange={value => {
                                // TODO: check stock when change quantity(even when reducing)
                                const newDetailedCartList = [...detailedCartList]
                                newDetailedCartList[index].quantity = value
                                setDetailedCartList(newDetailedCartList)
                              }}
                            />
                          </Typography.Text>
                        </Col>
                        <Col>
                          <Divider
                            type={'vertical'}
                          />
                        </Col>
                        <Col>
                          <a
                            onClick={() => {
                              const newDetailedCartList = [...detailedCartList]
                              newDetailedCartList.splice(index, 1)
                              setDetailedCartList(newDetailedCartList)
                            }}
                          >
                            Delete</a>
                        </Col>
                      </Row>
                    </Col>
                    {/*<Divider type={'vertical'} style={{height: '150px',}}/>*/}
                    <Col flex={'auto'}/>
                    <Col>
                      <span>
                        {
                          item?.sku?.finalPrice && item.sku.finalPrice !== item.sku.price && <Typography.Text
                            style={{
                              fontSize: 11,
                              fontWeight: 400,
                              color: '#afafaf',
                            }}
                            delete={true}
                          >
                            ${item.sku.price.toFixed(2)}
                          </Typography.Text>
                        }
                        <Typography.Text
                          style={{fontSize: 20, fontWeight: 700}}>${item.sku.finalPrice.toFixed(2)}</Typography.Text>
                      </span>

                    </Col>
                  </Row>
                  <Divider/>
                </div>
              )

            })
          }
        </Col>
        <Col
          style={{
            marginLeft: 20,
            marginRight: 20,
          }}
        >
          <Affix>
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
                <Typography.Title style={{marginTop: 0, fontWeight: 600, fontSize: 18}} level={5}>
                  Subtotal ({subTotal.count} items): ${subTotal.price}
                </Typography.Title>
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
                  onClick={onClickCheckout}
                >
                  Proceed to Checkout
                </Button>
              </Row>
            </div>
          </Affix>
        </Col>
      </Row>
    );
  }
;

export default Cart;
