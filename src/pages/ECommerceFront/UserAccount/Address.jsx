import React, {useEffect, useState} from 'react';
import {useModel} from "@/.umi/exports";
import {
  message,
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Space,
  Row,
  Col,
  Typography,
  Pagination,
  Table, Modal, Select, Breadcrumb
} from "antd";
import {history} from "@umijs/max";
import dbmsMember from "@/services/dbms-member";
import moment from "moment";
import constant from "@/utils/constant";
import country from "@/services/country";
import AccountBreadcrumb from "@/pages/ECommerceFront/UserAccount/components/AccountBreadcrumb";

const memberService = dbmsMember.memberController
const memberAddressService = dbmsMember.receivingAddressController
const countryService = country.countriesController
const citiesService = country.citiesController
const statesService = country.statesController

const EditForm = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
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

function Address(props) {
  const {userInfo, userLoading} = useModel('ecommerceFront');
  const [shippingAddress, setShippingAddress] = useState([])
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    list: [],
    onChange: (page, pageSize) => {
      fetchShippingAddress({
        [constant.CURRENT_PAGE_STR]: page,
        [constant.PAGE_SIZE_STR]: pageSize,
      })
    }
  })

  const fetchShippingAddress = async (pagination) => {
    if (userInfo && userInfo.username) {
      memberService
      .pageAddress({username: userInfo.username, params: pagination})
      .then(res => {

        setPagination({...pagination, ...res.data})
      })
    } else {
      console.error('currentUser is null')
    }
  }

  const shippingAddressTmp = {
    "id": 1,
    "memberId": 11,
    "name": "allen",
    "tele": "18806505999",
    "postcode": "31000",
    "state": "hangzhou",
    "city": "zhejiang",
    "country": "china",
    "address": "jiashenghuayuan"
  }
  const tableColumns = [
    {
      title: 'Full Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Phone Number',
      dataIndex: 'tele',
      key: 'tele',
    },
    {
      title: 'Postcode',
      dataIndex: 'postcode',
      key: 'postcode',
    },
    {
      title: 'Country',
      dataIndex: 'country',
      key: 'country',
    },
    {
      title: 'State/Province/Region',
      dataIndex: 'state',
      key: 'state',
    },
    {
      title: 'City',
      dataIndex: 'city',
      key: 'city',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <a onClick={() => {
            onClickEdit(record)
          }}>Edit</a>
          <a onClick={() => {
            onClickDelete(record)
          }}>Delete</a>
        </Space>
      ),
    }
  ]

  const {IDLE, EDIT, INSERT} = constant
  const [status, setStatus] = useState(IDLE)

  useEffect(() => {
    fetchShippingAddress({
      [constant.CURRENT_PAGE_STR]: pagination.current,
      [constant.PAGE_SIZE_STR]: pagination.pageSize,
    })
  }, [])

  const [editingAddress, setEditingAddress] = useState({})
  const onClickEdit = (record) => {
    setStatus(EDIT)
    setEditingAddress(record)
  }
  const onClickInsert = () => {
    setStatus(INSERT)
    setEditingAddress({})
  }
  const onClickDelete = (record) => {

  }
  const onClickCancel = () => {
    setStatus(IDLE)
  }
  const onClickSubmit = async (value) => {

    if (status === INSERT) {
      await memberService.addAddress({username: userInfo.username}, [value])
    } else if (status === EDIT) {
      value.id = editingAddress.id
      await memberAddressService.updateAll([value])
    }
    setStatus(IDLE)
    fetchShippingAddress({
      [constant.CURRENT_PAGE_STR]: pagination.current,
      [constant.PAGE_SIZE_STR]: pagination.pageSize,
    })
  }

  return (
    <Row
      style={{
        justifyContent: 'center',
        marginTop: '20px',
      }}
    >
      {
        status === EDIT || status === INSERT
          ? <EditForm initialData={editingAddress} onSubmit={onClickSubmit} onCancel={onClickCancel}/>
          : null
      }
      <Col
        flex={'1000px'}
      >
        <Button type={'primary'} onClick={() => {
          onClickInsert()
        }}
                style={{
                  alignSelf: 'flex-end',
                }}
        >Add New Address</Button>
        <Table
          columns={tableColumns}
          dataSource={pagination.list}
          rowKey={'id'}
          pagination={pagination}
        />
      </Col>
    </Row>
  );
}

export default Address;
