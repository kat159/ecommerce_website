import React, {useEffect, useState} from 'react';
import AccountBreadcrumb from "@/pages/ECommerceFront/UserAccount/components/AccountBreadcrumb";
import dbmsOrder from "@/services/dbms-order";
import {
  Button,
  Checkbox,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  Modal,
  Pagination, Rate,
  Row,
  Table,
  Typography,
  message, Spin, Descriptions
} from "antd";
import moment from "moment";
import MyImage from "@/components/DataDisplay/MyImage";
import {useModel} from "@/.umi/exports";
import MyDescription from "@/components/DataDisplay/List/MyDescription";

const orderService = dbmsOrder.orderController;

function Orders(props) {
  const {userInfo} = useModel('ecommerceFront');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    list: [],
    onChange: (page, pageSize) => {
      pageOrders(page, pageSize)
    }
  })
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [orderLoading, setOrderLoading] = useState(true);
  const pageOrders = async (current, pageSize) => {
    setOrderLoading(true);
    const res = await orderService.page({
      paginationDto: {
        current: current,
        pageSize: pageSize,
        username: userInfo.username,
      }
    }).catch(e => {
      setOrderLoading(false)
    })
    const {data = pagination} = res ?? {};

    setPagination({
      ...pagination,
      ...data,
    })
    setOrderLoading(false)
    return data
  }
  useEffect(() => {
    pageOrders(1, 5).then(res => {

      setExpandedRowKeys(res.list?.[0]?.id ? [res.list?.[0]?.id] : [])
    })
  }, [])
  const OrderPage = () => {
    const columns = [
      {
        title: 'Order ID',
        dataIndex: 'orderUUID',
        key: 'orderUUID',
      },
      {
        title: 'Order Date',
        dataIndex: 'createDate',
        key: 'createDate',
        render: (text, record) => {
          return moment(text).format('YYYY-MM-DD HH:mm:ss')
        }
      },
      {
        title: 'Shipping Address',
        key: 'shippingAddress',
        render: (text, record) => {
          return `${record.shippingCountry} ${record.shippingState} ${record.shippingCity} ${record.shippingAddress}`
        }
      },
      {
        title: 'Total Price',
        dataIndex: 'finalTotalPrice',
        key: 'finalTotalPrice',
        render: (text, record) => {
          return <Typography.Text
            style={{fontSize: 16, color: '#000', fontWeight: 'bold'}}
          >${text}</Typography.Text>
        }
      },
    ];
    const REQUESTING_REFUND = 'REQUESTING_REFUND';
    const WRITING_REVIEW = 'WRITING_REVIEW';
    const IDLE = 'IDLE';
    const [status, setStatus] = useState(IDLE);
    const [editingOrderSku, setEditingOrderSku] = useState(null);

    const onCancelForm = () => {
      setStatus(IDLE);
    }
    const REQUESTING = 'REFUND_WITHOUT_RETURN_REQUESTED_AND_DELIVERED'
    const APPROVED = 'REFUND_WITHOUT_RETURN_APPROVED_AND_DELIVERED'
    const REJECTED = 'REFUND_WITHOUT_RETURN_REJECTED_AND_DELIVERED'
    const onSubmitRefund = async (data) => {

      if (editingOrderSku.status === REQUESTING) {
        message.error('You have already requested refund for this order')
        return
      }
      setStatus(IDLE);
      orderService.requestRefund(
        {orderSkuId: editingOrderSku.id},
        {
          ...data,
          username: userInfo.username,
        }
      ).then(() => {
        message.success('Request refund successfully');
      })
    }
    const onSubmitReview = async (id, rating) => {
      await orderService.review(
        {orderSkuId: id},
        {rating: rating}
      );
      const newPagination = {
        ...pagination,
        list: pagination.list.map(order => {
          return {
            ...order,
            orderSkus: order.orderSkus?.map(orderSku => {
              if (orderSku.id === id) {
                return {
                  ...orderSku,
                  rating: rating
                }
              }
              return orderSku;
            })
          }
        })
      };
      setPagination(newPagination);
      message.success('Review submitted successfully');
    }
    const onClickRefund = (orderSku) => {
      setStatus(REQUESTING_REFUND);
      setEditingOrderSku(orderSku)
    }
    const RequestRefundForm = () => {
      const [form] = Form.useForm();
      useEffect(() => {
        form.setFieldsValue({
          reason: 'I want refund.',
          refundQuantity: Math.max(editingOrderSku.skuQuantity - editingOrderSku.refundedQuantity, 0),
          refundPerSkuPrice: Math.max(editingOrderSku.skuFinalPrice - editingOrderSku.refundedPricePerSku, 0),
        })
      }, [])
      const onFinish = async () => {
        const data = await form.validateFields();
        onSubmitRefund(data);
      }
      return <Modal open={true} title={"Edit Your Shipping Address"} okText="Submit" cancelText="Cancel"
                    onCancel={() => {
                      onCancelForm()
                    }}
                    onOk={onFinish}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="reason"
            label="Reason"
            rules={[{required: true, message: 'Please enter your reason'}]}
          >
            <Input.TextArea rows={4}
            />
          </Form.Item>
          <Form.Item
            name="refundQuantity"
            label={`Refund Quantity (Max: ${Math.max(editingOrderSku.skuQuantity - editingOrderSku.refundedQuantity, 0)}, Refunded: ${editingOrderSku.refundedQuantity}, Original: ${editingOrderSku.skuQuantity})`}
            rules={[
              {required: true, message: 'Please enter refund quantity'},
            ]}
          >
            <InputNumber min={0} max={Math.max(editingOrderSku.skuQuantity - editingOrderSku.refundedQuantity, 0)}
            />
          </Form.Item>
          <Form.Item
            name="refundPerSkuPrice"
            label={`Refund Per Sku Price (Max: $${Math.max(editingOrderSku.skuFinalPrice - editingOrderSku.refundedPricePerSku, 0)}, Refunded: $${editingOrderSku.refundedPricePerSku}, Original: $${editingOrderSku.skuFinalPrice})`}
            rules={[
              {required: true, message: 'Please enter refund per sku price'},
            ]}
          >
            <InputNumber prefix={'$'} min={0} max={editingOrderSku.skuFinalPrice - editingOrderSku.refundedPricePerSku}
            />
          </Form.Item>
        </Form>
      </Modal>
    }
    const RefundData = ({
      sku, order
    }) => {
      const [isViewingHistory, setIsViewingHistory] = useState(false);
      const RefundHistory = ({sku, order}) => {
        const {refundRequests} = sku;
        refundRequests.reverse()

        return (
          <Modal
            title="Refund History"
            footer={null}
            open={true}
            onCancel={() => {
              setIsViewingHistory(false)
            }}
            width={'90%'}
            bodyStyle={{maxHeight: 'calc(100vh - 200px)', overflowY: 'auto'}}
          >
            {
              refundRequests.map((refundRequest, index) => {
                return (
                  <div key={index}>
                    {
                      index !== 0 && <Divider
                        style={{
                          border: 'solid 1px #000',
                          borderColor: '#777777',
                          borderCollapse: 'collapse',
                        }}
                      />
                    }
                    <Descriptions bordered column={6}
                                  size={'small'}
                                  layout={'vertical'}
                    >
                      <Descriptions.Item label="Request User" span={2}>{refundRequest.username}</Descriptions.Item>
                      <Descriptions.Item label="Request Date"
                                         span={2}>{moment(refundRequest.createDate).format('YYYY-MM-DD HH:mm:ss')}</Descriptions.Item>
                      <Descriptions.Item label="Request Status" span={2}>
                      <span
                        style={{
                          color: refundRequest.status === 'APPROVED' ? 'green' : refundRequest.status === 'REJECTED' ? 'red' : 'black',
                          fontWeight: 'bold',
                          fontSize: 16
                        }}
                      >
                      {refundRequest.status}
                      </span>
                      </Descriptions.Item>
                      <Descriptions.Item label="Request Reason" span={6}>{refundRequest.reason}</Descriptions.Item>
                      <Descriptions.Item label="Handler"
                                         span={2}>{refundRequest.handlerUsername}</Descriptions.Item>
                      <Descriptions.Item label="Handle Date"
                                         span={4}>{moment(refundRequest.handleDate).format('YYYY-MM-DD HH:mm:ss')}</Descriptions.Item>
                      <Descriptions.Item label="Handle Reason"
                                         span={6}>{refundRequest.handleReason}</Descriptions.Item>
                    </Descriptions>
                  </div>
                )
              })
            }
          </Modal>
        )
      }
      const {status: type, refundRequestPricePerSku: price, refundRequestQuantity: quantity} = sku
      if (![REQUESTING, APPROVED, REJECTED].includes(type)) {
        return null
      }
      const username = type === REQUESTING ? sku.username : sku.refundHandlerUsername
      const reason = type === REQUESTING ? sku.refundRequestReason : sku.refundHandlerNote
      let date = type === REQUESTING ? sku.refundRequestDate : sku.refundHandleDate
      date = moment(date).format('YYYY-MM-DD HH:mm:ss')
      // price, quantity, username, reason, type
      const data = type === REQUESTING ? [
        {
          label: 'Request Price per Unit',
          value: `$${price}`
        },
        {
          label: 'Request Quantity',
          value: quantity
        },
        {
          label: 'Request Date',
          value: date
        },
        {
          label: 'Request Reason',
          value: reason
        }
      ] : [
        {
          label: 'Request Price per Unit',
          value: `$${price}`
        },
        {
          label: 'Request Quantity',
          value: quantity
        },
        {
          label: 'Request Date',
          value: moment(sku.refundRequestDate).format('YYYY-MM-DD HH:mm:ss')
        },
        {
          label: 'Handler',
          value: username
        },
        {
          label: 'Handle Reason',
          value: reason
        },
        {
          label: 'Handle Date',
          value: moment(sku.refundHandleDate).format('YYYY-MM-DD HH:mm:ss')
        }
      ]
      return type && <div>
        {isViewingHistory && <RefundHistory sku={sku} order={order}/>}
        <Typography.Paragraph
          style={{
            marginBottom: 0,
          }}
        >
          <Typography.Paragraph
            style={{
              fontSize: 16,
              fontWeight: 600,
              marginBottom: 5,
            }}
            type={type === REQUESTING ? 'warning' : type === APPROVED ? 'success' : 'danger'}
          >
            {type === REQUESTING ? 'Requesting Refund' : type === APPROVED ? 'Refund Approved' : 'Refund Rejected'}
            <a
              style={{
                fontSize: 12,
                fontWeight: 400,
                marginLeft: 10,
                color: 'none'
              }}
              onClick={() => {
                setIsViewingHistory(true)
              }}
            >
              view refund history
            </a>
          </Typography.Paragraph>
        </Typography.Paragraph>
        <MyDescription data={data}/>
      </div>
    }
    return (
      <div
      >
        {
          status === REQUESTING_REFUND && <RequestRefundForm/>
        }
        <Table
          style={{
            minWidth: 1400,
          }}
          columns={columns}
          dataSource={pagination.list.map(order => {
            return {...order, key: order.id}
          })}
          pagination={pagination}
          expandable={{
            expandedRowRender: (record) => (
              record.orderSkus.map((sku, index) => {
                return (
                  sku && <div key={index}
                  >
                    <Row
                      style={{
                        marginLeft: 10,
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Col style={{width: 100,}}>
                        <span
                          style={{
                            padding: 10,
                            border: '1px solid #e8e8e8',
                            display: 'inline-block',
                            borderRadius: 10,
                          }}
                        >
                          <MyImage.FitSize
                            url={sku.skuImg}
                          />
                        </span>
                      </Col>
                      <Col span={4}
                      >
                        <Row>
                          <Typography.Title level={5}
                                            style={{marginBottom: 0, marginTop: 0}}
                          >
                            {sku.skuName}
                          </Typography.Title>
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
                              Qty: {sku.skuQuantity}
                            </Typography.Text>
                          </Col>
                        </Row>
                        <Row>
                          <span>
                          {
                            sku?.skuFinalPrice && sku.skuFinalPrice !== sku.skuOriginalPrice && <Typography.Text
                              style={{
                                fontSize: 11,
                                fontWeight: 400,
                                color: '#afafaf',
                              }}
                              delete={true}
                            >
                              ${sku.skuOriginalPrice.toFixed(2)}
                            </Typography.Text>
                          }
                            <Typography.Text
                              style={{fontSize: 20, fontWeight: 700}}>${sku.skuFinalPrice.toFixed(2)}</Typography.Text>
                        </span>
                        </Row>
                      </Col>
                      <Col span={2}
                      >
                        <Row
                          style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100%',
                          }}
                        >
                          <Typography.Text style={{fontSize: 16, fontWeight: 700}}>
                            <span style={{color: 'green'}}>Delivered</span>
                          </Typography.Text>
                        </Row>
                      </Col>
                      <Col span={7}
                      >
                        <RefundData sku={sku} order={record}/>
                      </Col>
                      <Col span={4}
                      >
                        {
                          sku.refundedQuantity && sku.refundedQuantity > 0 && <Row
                            style={{
                              alignItems: 'center',
                              height: '100%',
                            }}
                          >
                            {
                              <MyDescription
                                data={[
                                  {
                                    label: 'Refunded Price per Unit',
                                    value: `$${sku.refundedPricePerSku}`
                                  },
                                  {
                                    label: 'Refunded Quantity',
                                    value: sku.refundedQuantity
                                  }
                                ]}
                              />
                            }
                          </Row>
                        }

                      </Col>
                      <Col span={3}
                      >
                        <Row
                          style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100%',
                          }}
                        >
                          <Col>
                            <Row>
                              <Button type={'link'}
                                      onClick={() => onClickRefund(sku)}
                                      style={{

                                      }}
                              >Request a Refund</Button>
                            </Row>
                            <Row>
                              <Rate allowHalf value={sku.rating} disabled={sku.rating ?? false}
                                    onChange={(value) => {
                                      onSubmitReview(sku.id, value)
                                    }}
                              />
                            </Row>
                          </Col>
                        </Row>
                      </Col>
                      <Col span={0.5}/>
                    </Row>
                    <Divider/>
                  </div>
                )
              })
            ),
            expandedRowKeys: expandedRowKeys,
            onExpand: (expanded, record) => {
              if (expanded) {
                setExpandedRowKeys([...expandedRowKeys, record.id])
              } else {
                setExpandedRowKeys(expandedRowKeys.filter(key => key !== record.id))
              }
            }
          }}
        />
      </div>
    )
  }

  return (
    <Spin
      spinning={orderLoading}
    >
      <OrderPage
        list={pagination.list}
        pagination={pagination}
      />
    </Spin>
  );
}

export default Orders;
