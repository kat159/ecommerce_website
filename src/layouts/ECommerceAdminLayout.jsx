import React, {useEffect} from 'react';
import {Outlet} from 'umi';
import dbmsProduct from "@/services/dbms-product";
import {history, useModel} from 'umi';
import {Avatar, Badge, Col, Dropdown, Input, Layout, Menu, Row, Space, Spin} from "antd";
import {PlusOutlined, ShopOutlined, ShoppingCartOutlined, UserOutlined} from "@ant-design/icons";
import './less.less';
import {ecommerceAdminRoutes} from "../../config/childrenRoutes";
import {ecommerceAdminRoutesArr} from "../../config/childrenRoutes";

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
  console.log('cur path', window.location.origin + window.location.pathname)
  const Head = () => {
    const Logo = (
      <span
        className={'hoverable'}
        style={{
          fontSize: 32,
          color: '#fff',
        }}
        onClick={() => {
          history.push('/category')
        }}
      >
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
                    redirectUri: window.location.origin + window.location.pathname
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
        className={'hoverable'}
        style={{
          fontSize: 18,
          color: 'white',
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
  const SideMenu = () => {
    const getItems = (items) => {
      if (!items) return []
      return items.filter(item => item.layout !== false && item.component).map((item, index) => {
        if (item.routes) {
          return {
            key: item.path,
            label: item.name,
            children: getItems(item.routes),
          }
        } else {
          return {
            key: item.path,
            label: item.name,
          }
        }
      })
    }
    return (
      <Menu
        items={getItems(ecommerceAdminRoutesArr)}
      />
    )
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
            // background: '#fff',
            padding: 0,
          }}
        >
          <Head/>
        </Layout.Header>
        <Layout>
          <Layout.Sider>
            <SideMenu/>
          </Layout.Sider>
          <div
            style={{
              background: '#fff',
            }}
          >
            {loading ? <div/> : <Outlet/>}
          </div>
        </Layout>
      </Layout>
    </div>
  );
}

