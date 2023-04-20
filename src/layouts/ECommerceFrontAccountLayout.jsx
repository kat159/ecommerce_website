import React, {useEffect} from 'react';
import {Outlet, useLocation} from 'umi';
import dbmsProduct from "@/services/dbms-product";
import {history, useModel} from 'umi';
import {Avatar, Badge, Breadcrumb, Col, Dropdown, Input, Layout, Row, Space, Spin, Typography} from "antd";
import {PlusOutlined, ShopOutlined, ShoppingCartOutlined, UserOutlined} from "@ant-design/icons";
import './less.less';

const categoryService = dbmsProduct.categoryController
const productService = dbmsProduct.productController
export default function (props) {

  const {initialState, loading: initStateLoading, refresh, setInitialState} = useModel('@@initialState')
  const {currentUser} = initialState || {}; // current user是注册中心的，具体的当前app的用户要从app的数据拿
  const {userInfo, userLoading, fetchUserInfo} = useModel('ecommerceFront');


  const location = useLocation();
  const curPath = location.pathname.split('/')[location.pathname.split('/').length - 1]
  const curPathTitle =
    curPath === 'profile' ? 'Profile'
      : curPath === 'address' ? 'Address'
      : curPath === 'browse-history' ? 'Browse History'
      : curPath === 'order' ? 'Orders'
      : 'Account'

  return (
    <Row
      style={{
        justifyContent: 'center',
      }}
    >
      <Col style={{
        // width: 'fit-content',
      }}
        >
        <Breadcrumb
          style={{
            margin: '16px 0',
            FontSize: '20px',
            fontWeight: 'bold',
          }}
        >
          <Breadcrumb.Item className={'hoverable'}>
          <span
            onClick={() => {
              history.push('/ecommerce/front/account')
            }}
          >
            Your Account
          </span>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            {curPathTitle}
          </Breadcrumb.Item>
        </Breadcrumb>
        <Outlet/>
      </Col>


    </Row>
  );
}

