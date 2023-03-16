import React from 'react';
import {history, useModel} from "@/.umi/exports";
import {Card, Carousel, Col, Divider, Layout, Menu, Row, Typography} from "antd";
import MyImage from "@/components/DataDisplay/MyImage";
import {GiftOutlined} from "@ant-design/icons";
import Slider from "react-slick";
function NoCategory() {
  const {categoryIdMap, categoryForest} = useModel('ECommerceFront.category');
  const childCategories = categoryForest;

  const onClickCategory = ({category}) => {
    const categoryPath = []
    let curCategory = category;
    while (curCategory && curCategory.id !== 0) {
      categoryPath.push(curCategory.id)
      curCategory = categoryIdMap[curCategory.parentId]
    }
    console.log('categoryPath', categoryPath)
    history.push(`${window.location.pathname}?category=${categoryPath.reverse().join(',')}`);
  };
  const ShopCategory = () => {
    console.log('childCategories', childCategories)
    const ByGrid = (
      <Card className={'card-grid-no-empty-border'}
        // bordered={false}
      >
        {
          childCategories.map((category, index) => {
            const {name, icon: url} = category;
            return (
              <Card.Grid
                key={index}
                style={{
                  width: '25%',
                  minWidth: '200px',
                  maxWidth: '300px',
                  textAlign: 'center',
                }}
              >
                <MyImage.FitSize url={url}/>
                <Typography.Title level={3}>{name}</Typography.Title>
              </Card.Grid>
            )
          })
        }
      </Card>
    )
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
  const CarouselAds = () => {
    const ads = [
      {
        title: 'AAphone',
        img: 'https://firebasestorage.googleapis.com/v0/b/ecommerce-6ee5d.appspot.com/o/home-ad%2Fpexels-negative-space-48605_11zon.jpg?alt=media&token=3bd6e6e2-62e2-4609-969f-03e55289ab30',
        url: 'http://localhost:8000/ecommerce/front/category?category=1,2,3&sku=178',
      },
      {
        title: 'Up to 50% off',
        img: 'https://firebasestorage.googleapis.com/v0/b/ecommerce-6ee5d.appspot.com/o/home-ad%2Fpexels-neosiam-594452.jpg?alt=media&token=cb5a87b8-2253-4632-b324-bc051fd1c478',
        url: 'http://localhost:8000/ecommerce/front/category?category=1,2,3&sku=195',
      }

    ]
    const contentStyle = {
      height: '160px',
      color: '#fff',
      lineHeight: '160px',
      textAlign: 'center',
      background: '#364d79',
    };
    return (
      <Carousel autoplay>
        {
          ads.map((ad, index) => {
            return <a
              key={index}
              onClick={e => {
                e.stopPropagation()
                history.push(ad.url)
              }}
              style={{
                position: 'relative',
                textAlign: 'center',
              }}
            >
              <img src={ad.img}
                   key={index}
                   style={{
                      width: '100%',
                   }}
              />
            </a>

          })
        }
      </Carousel>
    );
  }
  const CategoryNavBar = () => {
    const getItems = (categoryForest) => {
      return categoryForest.map((category) => {
        return {
          key: category.id,
          label: (
            <span
            >
              <Typography.Text>
              {category.name}
              </Typography.Text>
            </span>
          ),
          onTitleClick: (e) => {
            console.log('CLICK title', category)
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
            console.log(broken);
          }}
          onCollapse={(collapsed, type) => {
            console.log(collapsed, type);
          }}
          style={{
            background: 'transparent',
            fontWeight: 'bold',
          }}
        >
          <Menu
            style={{
              // width: 'fit-content',
              height: '100%',
              background: 'transparent'
            }}
            // mode="vertical"
            items={items}
            onClick={e => {
              console.log('CLICK', e)
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
        style={{
          maxWidth: 'calc(100% - 350px)',
        }}
      >
        <CarouselAds/>

        <ShopCategory/>
        <Typography.Title level={3}>Featured ItemsFeatured ItemsFeatured ItemsFeatured ItemsFeatured ItemsFeatured
          ItemsFeatured ItemsFeatured ItemsFeatured ItemsFeatured ItemsFeatured ItemsFeatured ItemsFeatured
          ItemsFeatured ItemsFeatured Items</Typography.Title>
        <Typography.Title level={3}>Featured Items</Typography.Title>
      </Col>
    </Row>
  );
}

export default NoCategory;
