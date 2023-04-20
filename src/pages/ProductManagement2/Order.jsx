import React, {useEffect, useState} from 'react';
import {
  Badge,
  Button,
  Col, Descriptions,
  Divider,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Radio,
  Rate,
  Row, Spin,
  Table,
  Typography
} from "antd";
import dbmsOrder from "@/services/dbms-order";
import moment from "moment";
import MyImage from "@/components/DataDisplay/MyImage";
import {useModel} from "umi";
import MyRandom from "@/utils/myRandom";
import MyDescription from "@/components/DataDisplay/List/MyDescription";

const orderService = dbmsOrder.orderController;

function Order(props) {
  const {userInfo} = useModel('ecommerceFront');
  const orderStates = [
    {value: 'all', label: 'View All'},
    {value: 'REFUND_WITHOUT_RETURN_REQUESTED_AND_DELIVERED', label: 'Order Requesting Refund'},
  ]
  const [selectedOrderState, setSelectedOrderState] = React.useState(null);
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
        status: selectedOrderState === 'all' ? null : selectedOrderState,
      }
    }).catch(e => {
      message.error("failed to get orders")
      setOrderLoading(false)
    })

    let {data} = res ?? {};
    data = data ?? {
      ...pagination,
      current: 1,
      pageSize: 10,
      total: 0,
      list: []
    }


    setPagination({
      ...pagination,
      ...data,
      current: data.current + 1,
    })
    setOrderLoading(false)
    return data
  }
  useEffect(() => {
    pageOrders(1, 5).then(res => {

      setExpandedRowKeys(res.list?.[0]?.id ? [res.list?.[0]?.id] : [])
    })
  }, [selectedOrderState])
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
        title: 'Username',
        dataIndex: 'username',
        key: 'username',
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
    const [writingNoteFor, setWritingNoteFor] = useState(null); // 1-approve refund, 2-reject refund
    const [writingNodeForOrderSku, setWritingNodeForOrderSku] = useState(null);
    const onClickApproveRefund = (orderSku) => {
      setWritingNoteFor(1)
      setWritingNodeForOrderSku(orderSku)
    }
    const onClickRejectRefund = (orderSku) => {
      setWritingNoteFor(2)
      setWritingNodeForOrderSku(orderSku)
    }
    const onClickSubmitNote = (data) => {
      orderService.manageRefundRequest({
        refundRequestId: writingNodeForOrderSku.refundRequestId,
        isApproved: writingNoteFor,
        username: userInfo.username,
        reason: data.reason
      })
      setWritingNoteFor(null)
      setWritingNodeForOrderSku(null)
    }
    const onCancelForm = () => {
      setWritingNoteFor(null)
      setWritingNodeForOrderSku(null)
    }
    const RequestRefundForm = () => {
      const [form] = Form.useForm();
      useEffect(() => {
        form.setFieldsValue({
          reason: writingNoteFor === 1 ? 'I approve it' : 'I reject it'
        })
      }, [])
      const onFinish = async () => {
        const data = await form.validateFields();
        onClickSubmitNote(data);
      }
      return <Modal
        open={true} title={"Decision Reason"} okText="Submit" cancelText="Cancel"
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
        </Form>
      </Modal>
    }
    const REQUESTING = 'REFUND_WITHOUT_RETURN_REQUESTED_AND_DELIVERED'
    const APPROVED = 'REFUND_WITHOUT_RETURN_APPROVED_AND_DELIVERED'
    const REJECTED = 'REFUND_WITHOUT_RETURN_REJECTED_AND_DELIVERED'
    const OrderSkuRow = ({sku, order}) => {
      const RefundData = ({
        sku
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
                    <div key={index}
                    >
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
        const data = (
          type === REQUESTING ? [
              {
                label: 'Request Price per Unit',
                value: `$${price}`
              },
              {
                label: 'Request Quantity',
                value: quantity
              },
              {
                label: 'Request User',
                value: username
              },
              {
                label: 'Request Date',
                value: date
              },
              {
                label: 'Request Reason',
                value: reason
              }
            ] :
            [
              {
                label: 'Request Price per Unit',
                value: `$${price}`
              },
              {
                label: 'Request Quantity',
                value: quantity
              },
              {
                label: 'Request User',
                value: username
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
        )
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
        <Row
          style={{
            marginLeft: 10,
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Col
            style={{width: 100,}}
          >
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
              {
                sku.rating ? <Rate allowHalf value={sku.rating} disabled={sku.rating ?? false}
                                   onChange={(value) => {
                                     onSubmitReview(sku.id, value)
                                   }}
                                   style={{
                                     fontSize: 13,
                                   }}
                /> : <Typography.Paragraph
                  style={{marginBottom: 0, marginTop: 0, fontSize: 14, fontWeight: 700}}>
                  Not Rated
                </Typography.Paragraph>
              }
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
          <Col span={6}
          >
            <Row
              style={{
                alignItems: 'center',
                height: '100%',
              }}
            >
              {
                <RefundData
                  sku={{...sku, username: order.username}}
                />
              }
            </Row>
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
          <Col span={2}
          >
            {
              sku.status === 'REFUND_WITHOUT_RETURN_REQUESTED_AND_DELIVERED' && (
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
                              onClick={() => onClickApproveRefund(sku)}
                      >Approve Refund</Button>
                    </Row>
                    <Row>
                      <Button type={'link'}
                              onClick={() => onClickRejectRefund(sku)}
                      >Reject Refund</Button>
                    </Row>
                  </Col>
                </Row>
              )
            }
          </Col>
        </Row>
      )
    }
    return (
      <div
      >
        {
          writingNodeForOrderSku && writingNoteFor && <RequestRefundForm/>
        }
        <Table
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
                    <OrderSkuRow sku={sku} order={record}/>
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
      <Radio.Group value={selectedOrderState} onChange={(e) => setSelectedOrderState(e.target.value)}
                   style={{marginBottom: 8}}
      >
        {
          orderStates.map((orderState, index) => {
            return (
              <Radio.Button key={index} value={orderState.value}>{orderState.label}</Radio.Button>
            )
          })
        }

      </Radio.Group>
      <OrderPage
        list={pagination.list}
        pagination={pagination}
      />
    </Spin>
  );
}

export default Order;
