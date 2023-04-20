/* eslint-disable react/jsx-no-undef */
import React from 'react';
import {history, useModel} from "@/.umi/exports";
import {Card, Col, Divider, Layout, Menu, Row, Typography} from "antd";
import MyImage from "@/components/DataDisplay/MyImage";
import {GiftOutlined} from "@ant-design/icons";

function FirstLevelCategory({
  curCategory
}) {
  const {categoryIdMap} = useModel('ECommerceFront.category');

  const childCategories = curCategory.children;
  const onClickCategory = ({category}) => {
    const categoryPath = []
    let curCategory = category;
    while (curCategory && curCategory.id !== 0) {
      categoryPath.push(curCategory.id)
      curCategory = categoryIdMap[curCategory.parentId]
    }

    history.push(`${window.location.pathname}?category=${categoryPath.reverse().join(',')}`);
  };
  const ShopCategory = () => {

    const ByRow = (
      <Row className={'ant-row-no-newline'}
      >
        {
          childCategories.map((category, index) => {
            const {name, icon: url} = category;
            return (
              <Col
                key={index}
                // flex={'1 0 300px'}
                xs={{span: 12}}
                sm={{span: 12}}
                md={{span: 8}}
                lg={{span: 6}}
                xl={{span: 6}}
                xxl={{span: 6}}
              >
                <Card
                  className={'my-image-card'}
                  onClick={(e) => {
                    e.stopPropagation()
                    onClickCategory({category})
                  }}
                  hoverable
                  cover={
                    <MyImage.FitSize url={url}/>
                  }
                >
                  <Card.Meta
                    title={
                      <Typography.Title
                        level={5}
                        style={{
                          marginBottom: '0px',
                          marginTop: '0px',
                        }}
                        ellipsis={{
                          rows: 1,
                          tooltip: name,
                        }}
                      >
                        {name}
                      </Typography.Title>
                    }
                  />
                </Card>
              </Col>
            )
          })
        }
      </Row>
    )
    return <div>
      <Typography.Title level={3}>Shop Category</Typography.Title>
      {ByRow}
    </div>
  }
  const CategoryNavBar = () => {
    const getItems = (categoryForest) => {
      return categoryForest.map((category) => {
        return {
          key: category.id,
          label: (
            <span
            >
              <Typography.Text
              >
              {category.name}
              </Typography.Text>
            </span>
          ),
          onTitleClick: (e) => {

            onClickCategory({category})
          },
          children: category.children?.length > 0 ? getItems(category.children) : null,
        }
      })
    }
    const items = getItems(childCategories);
    return (
      <Layout>
        <Layout.Sider
          className={'.my-menu-sider'}
          theme={'light'}
          width={'220px'}
          breakpoint="lg"
          collapsedWidth="0"
          onBreakpoint={(broken) => {

          }}
          onCollapse={(collapsed, type) => {

          }}
          style={{background: 'transparent', fontWeight: 'bold'}}
        >
          <Menu
            style={{
              // width: 'fit-content',
              height: '100%',
              background: 'transparent',
            }}
            // mode="vertical"
            items={items}
            onClick={e => {

              onClickCategory({category: categoryIdMap[e.key]})
            }}
          />
        </Layout.Sider>
      </Layout>
    )
  }
  return (
    <Row
      className={'ant-row-no-newline'}
      gutter={30}
      style={{
        maxWidth: screen.width * 0.8
      }}
    >
      <Col
        style={{
          maxWidth: '300px',
        }}
      >
        <CategoryNavBar/>
      </Col>
      <Col
        flex={'auto'}
      >
        <Typography.Title level={3}>Advertisement Carousel</Typography.Title>
        <ShopCategory/>
      </Col>
    </Row>
  );
}

export default FirstLevelCategory;
