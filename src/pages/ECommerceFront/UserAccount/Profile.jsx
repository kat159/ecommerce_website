import React, {useEffect} from 'react';
import {useModel} from "@/.umi/exports";
import {message, Button, DatePicker, Form, Input, InputNumber, Space, Row, Col, Typography} from "antd";
import {history} from "@umijs/max";
import dbmsMember from "@/services/dbms-member";
import moment from "moment";
import AccountBreadcrumb from "@/pages/ECommerceFront/UserAccount/components/AccountBreadcrumb";

const memberService = dbmsMember.memberController

function Profile(props) {
  const {userInfo, userLoading, fetchUserInfo} = useModel('ecommerceFront');

  const [form] = Form.useForm();
  useEffect(() => {
    userInfo.birth = userInfo.birth ? moment(userInfo.birth) : moment()
    form.setFieldsValue(userInfo)
  }, [userInfo])
  const handleSubmit = async () => {
    const data = await form.validateFields();
    data.id = userInfo.id
    data.birth = moment(data.birth)

    await memberService.updateAll([data]);
    message.success('Update success')
    fetchUserInfo()
  }
  const UserForm = (
    <div>
      <Form
        form={form}
      >
        <Form.Item
          label={'Nickname'}
          name={'nickname'}
        >
          <Input/>
        </Form.Item>
        <Form.Item
          label={'Email'}
          name={'email'}
          rules={[
            {
              type: 'email',
              message: 'The input is not valid E-mail!',
            }
          ]}
        >
          <Input/>
        </Form.Item>
        <Form.Item
          label={'Phone'}
          name={'tele'}
        >
          <InputNumber
            style={{
              width: '100%',
            }}
            placeholder="+1(757) 912 7580"
            formatter={
              input => {
                if (!input || input.length === 0) return '+1 ';
                const phoneNumber = input.replace(/[^\d]/g, '').slice(1, 11);
                const phoneNumberLength = phoneNumber.length;
                if (phoneNumberLength <= 0) {
                  return '+1 ';
                } else if (phoneNumberLength <= 3) {
                  return `+1(${phoneNumber})`;
                } else if (phoneNumberLength < 7) {
                  return `+1(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
                } else {
                  return `+1(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)} ${phoneNumber.slice(6, 10)}`;
                }
              }
            }
            parser={input => input.replace(/[^\d]/g, '')}
            width={'100%'}
          />
        </Form.Item>
        <Form.Item
          label={'Birthday'}
          name={'birth'}
        >
          <DatePicker/>
        </Form.Item>
        <Form.Item
          wrapperCol={{
            offset: 6,
            span: 12,
          }}
        >
          <Space>
            <Button onClick={handleSubmit}
                    type={'primary'}>
              Save
            </Button>
            <Button
              onClick={() => {
                history.go(-1)
              }}
            >
              Back
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  )
  return (
      <div
        style={{
          width: '1000px'
          }}
      >
        {UserForm}
      </div>
  );
}

export default Profile;
