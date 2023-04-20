import React, {useEffect} from 'react';
import {Outlet} from 'umi';
import dbmsProduct from "@/services/dbms-product";
import {history, useModel} from 'umi';
import {Avatar, Badge, Col, Dropdown, Input, Layout, Row, Space, Spin, Typography} from "antd";
import {PlusOutlined, ShopOutlined, ShoppingCartOutlined, UserOutlined} from "@ant-design/icons";
import './less.less';

const categoryService = dbmsProduct.categoryController
const productService = dbmsProduct.productController
export default function (props) {

  const {initialState, loading: initStateLoading, refresh, setInitialState} = useModel('@@initialState')
  const {currentUser} = initialState || {}; // current user是注册中心的，具体的当前app的用户要从app的数据拿
  const {
    userInfo, userLoading, fetchUserInfo,
    cart, cartLoading,
  } = useModel('ecommerceFront');

  const [previewCartItems, setPreviewCartItems] = React.useState(null)
  const Head = () => {
    const Search = (
      <Input.Search
        className={'ecommerce-global-search'}
        placeholder={'in development...'}
        size="large"
        onSearch={value => {

        }}
        style={{
          marginTop: 16,
          minWidth: 100,
        }}
        disabled={true}
      />
    )
    const Logo = (
      <span
        onClick={() => {
          history.push('/ecommerce/front/category')
        }}
      >
      <ShopOutlined/>
      <span>Shop</span>
    </span>
    )
    const Cart = (
      cartLoading ? <Spin/> : <Badge
        // className={'clickable'}
        count={cart.length}
        size={'small'}
      >
        <Avatar
          shape="square"
          icon={
            <ShoppingCartOutlined
              style={{
                fontSize: 32,
                color: 'white',
              }}
            />
          }
        />
      </Badge>
    )
    return (
      <Layout.Header
        className={'ecommerce-front-layout-header'}
        style={{
          height: 64,
          // background: '#fff',
          padding: 0,
        }}
      >
        <Row
          // gutter={{xs: 8, sm: 16, md: 24, lg: 32,}}
          className={'ant-row-no-newline'}
          style={{
            alignItems: 'center',
          }}
        >
          <Col flex={'1.2%'}/>
          <Col className={'hoverable'} flex={'120px'}
               style={{
                 fontSize: 32,
                 color: '#1890ff',
                 // color: 'white',
                 fontWeight: 600,
                 // marginRight: 30,
                 // width: '120px',
               }}
          >
            {Logo}
          </Col>
          <Col flex={'1.2%'}/>
          <Col
            flex={"1 1 auto"}
          >
            {Search}
          </Col>
          <Col flex={'0.6%'}/>
          <Col className={'hoverable'} flex={'64px'}
          >
          <span
            className={'clickable'}
            style={{
              paddingLeft: 10,
              paddingRight: 15,
              paddingTop: 15,
              paddingBottom: 15,
            }}
            onClick={() => {history.push('/ecommerce/front/cart') }}
          >
          {Cart}
          </span>
          </Col>
          <Col className={'hoverable'}
               // flex={'90px'}
          >
            {
              userLoading ? <Spin/>
                : <Dropdown
                onClick={() => {history.push('/ecommerce/front/account')}}
                  menu={{
                    onClick: ({key}) => {
                      if (key === 'logout') {
                        initialState?.keycloak?.logout({redirectUrl: window.location.href})
                      }
                      history.push(key)
                    },
                    items: [
                      {
                        key: '/ecommerce/front/account',
                        label: <span>Account</span>,
                      },
                      {
                        key: '/ecommerce/front/account/profile',
                        label: <span>Profile</span>,
                      },
                      {
                        key: '/ecommerce/front/account/address',
                        label: <span>Address</span>,
                      },
                      // {
                      //   key: '/ecommerce/front/account/browse-history',
                      //   label: <span>Browse History</span>,
                      // },
                      {
                        key: '/ecommerce/front/account/order',
                        label: <span>Orders</span>,
                      },
                      {
                        key: 'logout',
                        label: <span>Logout</span>,
                      }
                    ]
                  }}
                >

                <Typography.Paragraph
                  ellipsis={{
                    rows: 1,
                    expandable: false,
                  }}
                  className={'clickable'}
                  style={{
                    color: 'white',
                    paddingLeft: 10,
                    paddingRight: 10,
                    paddingTop: 12,
                    paddingBottom: 11,
                    fontSize: 16,
                    fontWeight: 600,
                    marginBottom: 0,
                    maxWidth: 150,
                  }}
                >
                  Hi, {userInfo?.nickname}
                </Typography.Paragraph>
                </Dropdown>
            }
          </Col>
          <Col flex={'0.6%'}/>
        </Row>

      </Layout.Header>
    );
  }
  return (
    <div
      className={'my-layout'}
    >
      <Layout>
        <Head/>
        <div
          style={{
            background: 'transparent',
            // background: '#fff',
          }}
        >
          <Outlet/>
        </div>
      </Layout>
    </div>
  );
}

