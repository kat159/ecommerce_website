import React, {useEffect} from 'react';
import {Outlet} from 'umi';
import dbmsProduct from "@/services/dbms-product";
import {history, useModel} from 'umi';
import {Avatar, Badge, Col, Dropdown, Input, Layout, Row, Space, Spin} from "antd";
import {PlusOutlined, ShopOutlined, ShoppingCartOutlined, UserOutlined} from "@ant-design/icons";
import './less.less';
import {ecommerceAdminRoutes} from "../../config/childrenRoutes";
import {Project} from "@/components/icons/Icon";

const categoryService = dbmsProduct.categoryController
const productService = dbmsProduct.productController
export default function (props) {
  // const [categoryForest, setCategoryForest] = React.useState([]);
  // const fetchCategoryForest = async () => {
  //   const data = await categoryService.forest();

  //   setCategoryForest(data.data);
  // }
  const {categoryForest, loading} = useModel('ECommerceFront.category');
  const {initialState, loading: initStateLoading, refresh, setInitialState} = useModel('@@initialState')
  console.log('currentUser', initialState?.currentUser)
  const Head = () => {
    const Logo = (
      <span
        className={'hoverable'}
        style={{
          // fontSize: 21,
          // color: '#fff',
          fontFamily: '-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,\'Helvetica Neue\',Arial,\'Noto Sans\',sans-serif,\'Apple Color Emoji\',\'Segoe UI Emoji\',\'Segoe UI Symbol\',\'Noto Color Emoji\'',
          display: 'flex',
          alignItems: 'center',
          fontWeight: 600,
          color: 'rgba(0, 0, 0, 0.85)',
          fontSize: '18px',
        }}
        onClick={() => {
          history.push('/category')
        }}
      >
        <Project
          style={{
            fontSize: 30,
            paddingRight: '5px',
          }}
        />
      My Projects
    </span>
    )
    const User = (
      // <UserOutlined/>
      <Dropdown
        menu={{
          items: [
            {
              key: '1',
              label: <span
                onClick={() => {
                  initialState.keycloak.logout({
                    redirectUri: window.location.origin,
                  })
                }}
              >
                logout
              </span>,
            }
          ]
        }}
      >
      <span
        className={'hoverable options'}
        style={{
          fontSize: 14,
          // color: 'white',
        }}
      >
      {
        initialState?.currentUser?.username
          ? <span>Hi, {initialState?.currentUser?.username}</span>
          : <span>login</span>
      }
    </span>
      </Dropdown>

    )
    return (
      <div
      >
        <Row
          gutter={{
            xs: 8,
            sm: 16,
            md: 24,
            lg: 32,
          }}
        >
          <Col flex={'2%'}/>
          <Col>{Logo}</Col>
          <Col flex={"1 1 auto"}/>
          <Col>{User}</Col>
          <Col flex={'2%'}/>
        </Row>
      </div>
    );
  }
  return (
    <div
      className={'my-layout ecommerce-front-layout'}
    >
      <Layout>
        <Layout.Header
          className={'ecommerce-front-layout-header'}
          style={{
            height: 64,
            background: '#fff',
            padding: 0,
            borderBottom: '1px solid #e8e8e8',
          }}
        >
          <Head/>
        </Layout.Header>

        <div
          style={{
            background: '#fff',
          }}
        >
          {loading ? <div/> : <Outlet/>}
        </div>
      </Layout>
    </div>
  );
}

