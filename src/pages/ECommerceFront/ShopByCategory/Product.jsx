import React, {useState, useEffect, useMemo} from "react";
import {
  Row,
  Col,
  Card,
  Select,
  Typography,
  Divider,
  Tabs,
  Rate,
  List,
  Button,
  Carousel,
  Input,
  Radio, Space, Descriptions,
  message, Spin
} from 'antd';

const {Option} = Select;
const {Title, Text} = Typography;
import MyImage from "@/components/DataDisplay/MyImage";

const {FitSize} = MyImage;

import dbmsProduct from "@/services/dbms-product";
import Gallery from "@/components/DataDisplay/MyImage/Gallery";
import ImageGallery from "react-image-gallery";
import {TaobaoSquareFilled} from "@ant-design/icons";
import dbmsMember from "@/services/dbms-member";
import {useModel} from "umi";
const productService = dbmsProduct.productController;

const ProductPage = ({
  data
}) => {
  const {
    userInfo,
    cart, fetchCart, cartLoading
  } = useModel('ecommerceFront');
  console.log('render111', data)
  // selected sale attributes, changed by click
  const productSaleAttrs = data.productAttributeValues.filter((item) => item.attributeType === 0 || item.attributeType === 2);
  const [selectedSaleAttrValuesMap, setSelectedSaleAttrValuesMap]
    = useState(
    productSaleAttrs.reduce((acc, cur) => {
      acc[cur.attributeId] = cur.attributeValueList[0];
      return acc;
    }, {})
  )
  console.log(selectedSaleAttrValuesMap)
  // selected sku, change when selected sale attributes changed
  const [selectedSku, setSelectedSku] = useState(null);
  // change selected sku when selected sale attributes changed
  useEffect(() => {
    // TODO: 如果初始的selectedSaleAttrValuesMap的sku缺货/不存在，需要重新选择，要在初始前就判断筛选所有可用的选项
    console.log(data.skus)
    console.log('selectedSaleAttrValuesMap', selectedSaleAttrValuesMap)
    for (const sku of data.skus) {
      let match = true;
      for (const saleAttr of sku.saleAttrValues) {
        const {attributeId, attributeValue} = saleAttr;
        console.log(attributeId, attributeValue, selectedSaleAttrValuesMap[attributeId])
        if (saleAttr.attributeValue !== selectedSaleAttrValuesMap[saleAttr.attributeId]) {
          match = false;
          break;
        }
      }
      if (match) {
        console.log('match', sku)
        setSelectedSku(sku);
      }
    }
  }, [selectedSaleAttrValuesMap])

  const skuImageIdMap = useMemo(() => {
    return data.skuImages.reduce((acc, cur) => {
      const {id, img} = cur;
      const image = new Image();
      image.src = img;
      acc[cur.id] = <FitSize url={img}/>
      return acc;
    }, {});
  }, [data.skuImages])
  const SkuImages = useMemo(() => {
    // console.log('data.skuImages', data.skuImages)
  }, [data.skuImages])
  const LeftImageGallery = useMemo(() => {
    const imagesOfSelectedSku = selectedSku?.skuSkuImages?.map((item) => skuImageIdMap[item.skuImageId]) ?? [];
    console.log('imagesOfSelectedSku', imagesOfSelectedSku)
    let imageData = imagesOfSelectedSku.map((imageComponent) => ({
      original: imageComponent,
      thumbnail: imageComponent,
    }))
    // imageData = imageData.concat(imageData)
    return (
      // <Gallery urls={imagesOfSelectedSku.map((imageVo) => imageVo.img)}/>
      <ImageGallery
        className="image-gallery"
        items={imageData}
        showPlayButton={false}
        showFullscreenButton={false}
        showNav={false}
        showBullets={false}
        showThumbnails={true}
        showIndex={false}
        renderItem={(item) => (
          <div
            style={{
              padding: '0 min(10%, 10px)',
            }}
          >
            {item.original}
          </div>
        )}
        thumbnailWidth={50}
        renderThumbInner={(item) => (
          <div
            style={{
              padding: 'min(10%, 10px)',
              border: '1px solid #e8e8e8',
            }}
          >
            {/*<MyImage.FitSize url={item.original} style={{}}/>*/}
            {item.original}
          </div>
        )}
      />
      // <div>111</div>
    )
  }, [selectedSku])
  const RightProductInfo = useMemo(() => {
    if (!selectedSku) {
      return null
    }
    const {name, title, subtitle, price, stock, rating, saleCount, description, primeDiscount, giftCardBonus} = selectedSku;
    const Price = (
      <div>
          <span
            style={{
              textDecoration: 'line-through',
              fontSize: '14px',
              color: '#999',
              fontFamily: 'Arial, Helvetica, sans-serif',
            }}
          >
            ${price.toFixed(2)}
          </span>
        <span
          style={{
            fontSize: '25px',
            color: 'black',
            fontWeight: 'bold',
            fontFamily: 'Arial, Helvetica, sans-serif',
          }}
        >
            ${(price * (1 - primeDiscount / 100)).toFixed(2)}
          </span>
      </div>
    )
    const SaleAttrSelector = (
      <div>
        <Space direction={'vertical'}>
          {productSaleAttrs.map((item, index) => {
            const {attributeId: saleAttrId, attributeValueList: saleAttrValues} = item;
            return (
              <div key={index}>
                <div
                  style={{
                    marginBottom: '5px',
                  }}
                >
                    <span
                      style={{
                        color: '#7a7a7a',
                      }}
                    >{item.attributeName}: </span>
                  <span
                    style={{
                      color: 'black',
                      fontWeight: '500',
                      fontSize: '16px',
                    }}
                  >{selectedSaleAttrValuesMap[saleAttrId]}</span>
                </div>
                <Space>
                  {
                    saleAttrValues.map((value, index) => {
                      return (
                        <Button
                          key={index}
                          // type={selectedSaleAttrValuesMap[saleAttrId] === value ? 'primary' : 'default'}
                          onClick={() => {
                            setSelectedSaleAttrValuesMap({
                              ...selectedSaleAttrValuesMap,
                              [saleAttrId]: value
                            })
                          }}
                          type="default"
                          style={{
                            borderColor: selectedSaleAttrValuesMap[saleAttrId] === value ? '#1890ff' : '#d9d9d9',
                          }}
                        >
                          {value}
                        </Button>
                      )
                    })
                  }
                </Space>
              </div>
            )
          })}
        </Space>
      </div>
    )
    const onClickAddToCart = () => {
      console.log('add to cart', selectedSku)
      dbmsMember.memberController.addToCart(
        {username: userInfo.username},
        [{
          skuId: selectedSku.id,
          quantity: 1,
        }]
      ).then(res => {
        fetchCart()
      }).catch(err => {
        console.error('add to cart err', err)
        message.error('add to cart error')
      })
    }
    return (
      <div>
        <Typography.Title level={3} ellipsis={{rows: 5,}} style={{marginTop: '0px',}}>
          {name}fgggggggggggggg ggggggggggggggggg gggggggggggggggggggggggggggg
        </Typography.Title>
        <Rate disabled value={rating} style={{fontSize: '14px',}}/>
        <Divider style={{marginTop: '10px',}}/>
        <div>{Price}</div>
        <Title style={{marginTop: '10px',}} level={5} type="success">Stock: {stock}</Title>
        <Divider style={{marginTop: '15px',}}/>
        {SaleAttrSelector}
        <Divider/>
        <Button onClick={onClickAddToCart} type="primary" size="large" block>Add to Cart</Button>
      </div>
    )
  }, [selectedSku])

  const Detail = useMemo(() => {
    const {attributeGroups} = data;
    const AttributeGroups = () => {
      const AttributeGroup = ({attributeGroup}) => {
        const {name, attributes} = attributeGroup;
        return (
          <Descriptions title={name} bordered column={1}>
            {
              attributes.map((attribute) => {
                const {id: attrId, name: attrName, selectableValueList} = attribute;
                let attrValue;
                if (selectedSaleAttrValuesMap[attrId]) {
                  attrValue = selectedSaleAttrValuesMap[attrId];
                } else {
                  attrValue = selectableValueList.join(', ');
                }
                return <Descriptions.Item
                  label={attribute.name}
                  key={attribute.id}
                >
                  {attrValue}
                </Descriptions.Item>
              })
            }
          </Descriptions>
        );
      };
      return (
        <div className={'description-list'}
        >
          {attributeGroups.map((attributeGroup) => (
            <AttributeGroup
              key={attributeGroup.id}
              attributeGroup={attributeGroup}
            />
          ))}
        </div>
      );
    };

    return (
      <Tabs
        defaultActiveKey="1"
        type="card"
        items={[
          {
            key: '1',
            label: 'Description',
            children: <AttributeGroups/>,
          },
          {
            key: '2',
            label: 'Specifications',
            children: <AttributeGroups/>,
          }
        ]}
      >
      </Tabs>
    )
  }, [selectedSku])
  return (
    selectedSku && <div
      className={'product-page'}
    >
      <Col style={{maxWidth: '1600px',}}>
        <Row className={'ant-row-no-newline'} gutter={30}>
          <Col style={{minWidth: '300px',}} span={10}>
            {LeftImageGallery}
          </Col>
          <Col className={''} flex={'auto'}>
            {RightProductInfo}
          </Col>
        </Row>
        <Divider />
        <Row>
          <Col flex={'auto'} className={'product-page-detail'}>
            {Detail}
          </Col>
        </Row>
      </Col>
    </div>
  );
};

function Product({
  skuId
}) {
  const [data, setData] = React.useState(null);
  useEffect(() => {
    console.log("skuId11", skuId)
    if (skuId !== undefined && skuId !== null) {
      productService.getDetailBySkuId({id: skuId}).then((res) => {
        console.log("res11", res);
        setData(res.data);
      })
    }
  }, [])
  return (
    // data && <PhoneProductPage data={data}/>
    data ? <ProductPage
      data={data}
    /> : <Spin />
    // 1
  )
}

export default Product;
