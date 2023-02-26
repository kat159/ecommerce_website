import React, {useEffect} from 'react';
import {Outlet} from 'umi';
import dbmsProduct from "@/services/dbms-product";
import {history, useModel} from 'umi';
import {Avatar, Badge, Col, Input, Layout, Row, Space, Spin} from "antd";
import {PlusOutlined, ShopOutlined, ShoppingCartOutlined, UserOutlined} from "@ant-design/icons";
import './less.less';

const categoryService = dbmsProduct.categoryController
const productService = dbmsProduct.productController
export default function (props) {
  // const [categoryForest, setCategoryForest] = React.useState([]);
  // const fetchCategoryForest = async () => {
  //   const data = await categoryService.forest();

  //   setCategoryForest(data.data);
  // }
  const {categoryForest, loading} = useModel('ECommerceFront.category');

  return (
    <div
      className={'my-layout'}
    >
      <Layout>
        <Head/>
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
        history.push('/category')
      }}
    >
      <ShopOutlined/>
      <span>Shop</span>
    </span>
  )
  const Cart = (
    <Badge count={5}>
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
  const User = (
    <UserOutlined/>
  )
  return (
    <Layout.Header
      style={{
        height: 64,
        // background: '#fff',
        padding: 0,
      }}
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
        <Col className={'hoverable'}
          style={{
            fontSize: 32,
            color: '#1890ff',
          }}
        >
          {Logo}
        </Col>
        <Col
          flex={"1 1 auto"}
        >
          {Search}
        </Col>
        <Col
          className={'hoverable'}
        >
          {Cart}
        </Col>
        <Col
          className={'hoverable'}
          style={{
            fontSize: 32,
            color: 'white',
          }}
        >
          {User}
        </Col>
        <Col flex={'2%'}/>
      </Row>

    </Layout.Header>
  );
}
