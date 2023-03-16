/* eslint-disable react/jsx-no-undef */
import React, {useEffect, useMemo} from 'react';
import dbmsProduct from "@/services/dbms-product";
import {useModel, history} from "umi";
import {Button, Card, Checkbox, Col, Collapse, InputNumber, Layout, Menu, Pagination, Row, Select, Space} from "antd";
import {CaretRightOutlined, GiftOutlined, ThunderboltOutlined} from "@ant-design/icons";
import './less.less';
import {v4 as uuid} from "uuid";
import constant from "@/utils/constant";
import {Prime} from "@/components/icons/Icon";
import MyImage from "@/components/DataDisplay/MyImage";
import dbmsMember from "@/services/dbms-member";

const {Meta} = Card;

const categoryService = dbmsProduct.categoryController
const productService = dbmsProduct.productController

function ThirdLevelCategory({
  categoryIds
}) {
  const {
    thirdLevelCategoryId,
    loading,
    attrGroups,
    fetchAttrGroups,
    saleAttrs,
    searchSaleAttrs,
    specAttrs,
    searchSpecAttrs,
  } = useModel('ECommerceFront.attribute');

  useEffect(() => {
    fetchAttrGroups(categoryIds[2]);
  }, [])
  const {userInfo} = useModel('ecommerceFront');
  const minPriceRef = React.useRef(null)
  const maxPriceRef = React.useRef(null)
  const [saleAttrFilters, setSaleAttrFilters] = React.useState({})
  const [specAttrFilters, setSpecAttrFilters] = React.useState({})
  const [priceRange, setPriceRange] = React.useState([null, null])
  const [confirmPriceRange, setConfirmPriceRange] = React.useState([null, null])
  const sortOptions = [
    {label: 'Featured', value: 0},
    {label: 'Price: Low to High', value: 1, sortField: 'final_price', sortOrder: 'asc'},
    {label: 'Price: High to Low', value: 2, sortField: 'final_price', sortOrder: 'desc'},
    // {label: 'Best Selling', value: 3, sortField: 'sales', sortOrder: 'desc'},
    // {label: 'Best Rating', value: 4, sortField: 'rating', sortOrder: 'desc'},
    // {label: 'Most Reviews', value: 5, sortField: 'reviews', sortOrder: 'desc'},
  ]
  const [selectedSortOption, setSelectedSortOption] = React.useState(0)
  const menuProps = useMemo(() => {
    const newMenuProps = {}
    const validSearchSaleAttrs = searchSaleAttrs.filter(attr => attr.selectableValueList?.length > 0)
    const validSearchSpecAttrs = searchSpecAttrs.filter(attr => attr.selectableValueList?.length > 0)
    const saleAttrItems = validSearchSaleAttrs.map((attr, index) => {
      const {attrName, selectableValueList, attrId} = attr
      return {
        key: index,
        label: <span style={{fontWeight: 'bold'}}>{attr.attrName}</span>,
        children: attr.selectableValueList.map((value, index) => {
          return {
            key: uuid(),
            label: <Checkbox
              checked={saleAttrFilters[attrId]?.has(value)}
              onClick={(e) => {
                e.stopPropagation();

                const newSaleAttrFilters = {...saleAttrFilters}
                if (newSaleAttrFilters[attrId]) {
                  if (newSaleAttrFilters[attrId].has(value)) {
                    newSaleAttrFilters[attrId].delete(value)
                  } else {
                    newSaleAttrFilters[attrId].add(value)
                  }
                } else {
                  newSaleAttrFilters[attrId] = new Set([value])
                }
                setSaleAttrFilters(newSaleAttrFilters)
              }}
            >{value}</Checkbox>,
          }
        })
      }
    })
    const specAttrItems = validSearchSpecAttrs.map((attr, index) => {
      return {
        key: index + validSearchSaleAttrs.length,
        label: <span style={{fontWeight: 'bold'}}>{attr.attrName}</span>,
        children: attr.selectableValueList.map((value, index) => {
          return {
            key: uuid(),
            label: <Checkbox
              checked={specAttrFilters[attr.attrId]?.has(value)}
              onClick={(e) => {
                e.stopPropagation();

                const newSpecAttrFilters = {...specAttrFilters}
                if (newSpecAttrFilters[attr.attrId]) {
                  if (newSpecAttrFilters[attr.attrId].has(value)) {
                    newSpecAttrFilters[attr.attrId].delete(value)
                  } else {
                    newSpecAttrFilters[attr.attrId].add(value)
                  }
                } else {
                  newSpecAttrFilters[attr.attrId] = new Set([value])
                }
                setSpecAttrFilters(newSpecAttrFilters)
              }}
            >{value}</Checkbox>,
          }
        })
      }
    })
    newMenuProps.items = saleAttrItems.concat(specAttrItems)
    newMenuProps.defaultOpenKeys = validSearchSaleAttrs.map((attr, index) => index.toString())
    return newMenuProps
  }, [searchSaleAttrs, searchSpecAttrs, saleAttrFilters, specAttrFilters])

  const [productList, setProductList] = React.useState([])
  const [pagination, setPagination] = React.useState({
    current: 1,
    pageSize: 36,
    total: 0,
    list: [],
    onChange: (page, pageSize) => {
      console.log('page', page)
      console.log('pageSize', pageSize)
      // setPagination({
      //   ...pagination,
      //   current: page,
      //   pageSize: pageSize,
      // })
      fetchProductList({
        current: page,
        pageSize: pageSize,
      })
    }
  })
  const fetchProductList = async ({
    current,
    pageSize,
  }) => {
    const params = {
      categoryId: categoryIds[2],
      saleAttrFilters: Object.keys(saleAttrFilters).map(attrId => {
        return {
          id: attrId,
          values: Array.from(saleAttrFilters[attrId]),
        }
      }),
      specAttrFilters: Object.keys(specAttrFilters).map(attrId => {
        return {
          id: attrId,
          values: Array.from(specAttrFilters[attrId]),
        }
      }),
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      [constant.SORT_FIELD_LIST]: selectedSortOption === 0 ? null : [sortOptions[selectedSortOption].sortField],
      [constant.SORT_ORDER_LIST]: selectedSortOption === 0 ? null : [sortOptions[selectedSortOption].sortOrder],
      [constant.CURRENT_PAGE_STR]: current,
      [constant.PAGE_SIZE_STR]: pageSize,
    }
    const res = await productService.search(params)
    const data = res?.data ?? {
      list: [],
      total: 0,
      [constant.CURRENT_PAGE_STR]: 1,
      [constant.PAGE_SIZE_STR]: pagination.pageSize,
    }
    console.log('data', data)
    // preload image
    if (data.list) {
      for (const sku of data.list) {
        if (sku.skuImages) {
          sku.defaultImg = sku.skuImages[0]
          const img = new Image()
          img.src = sku.defaultImg
        }
      }
    }
    // set data
    setPagination({...pagination, ...data})
  }
  useEffect(() => {
    console.log('=====filter changed=====')
    console.log('saleAttrFilters', saleAttrFilters)
    console.log('specAttrFilters', specAttrFilters)
    console.log('priceRange', priceRange)
    console.log('categoryIds', categoryIds)
    console.log('selectedSortOption', selectedSortOption)
    console.log('pagination', pagination)
    fetchProductList({
      current: 1,
      pageSize: pagination.pageSize,
    })
  }, [saleAttrFilters, specAttrFilters, selectedSortOption])

  const onSkuClick = (sku) => {
    console.log('click sku', sku)
    dbmsMember.memberController.addToBrowseHistory(
      {username: userInfo.username},
      [{skuId: sku.id}],
    )
    history.push(`${window.location.pathname}${window.location.search}&sku=${sku.id}`)
  }

  const HeadFilter = (
    <div className={'category-head-filter'}
         style={{
           margin: '10px',
           padding: '10px',
           background: 'rgba(0, 0, 0, 0.04)',
           // display: 'flex',
           // alignItems: 'center',
         }}
    >
      <Row
        justify={'space-between'}
      >
        <Col className={'category-head-filter-price-range'}
             style={{
               display: 'flex',
               alignItems: 'center',
             }}
             flex={'200px'}
        >
          <InputNumber
            ref={minPriceRef}
            prefix="$"
            formatter={(value) => `${value}`.replace('.', '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
            onChange={value => {
              setPriceRange([value, priceRange[1]])
            }}
            value={priceRange[0]}
            min={0}
            max={1E15}
            size='middle'
          />
          <span style={{margin: '0 8px'}}>-</span>
          <InputNumber
            ref={maxPriceRef}
            prefix="$"
            formatter={(value) => `${value}`.replace('.', '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
            onChange={value => {
              setPriceRange([priceRange[0], value])
            }}
            value={priceRange[1]}
            min={0}
            size='middle'
          />
          <Button
            type={'primary'}
            size={'small'}
            onClick={() => {
              fetchProductList({
                current: 1,
                pageSize: pagination.pageSize,
              })
            }}
            style={{
              margin: '0 8px',
            }}>GO</Button>

        </Col>
        <Col className={'category-head-filter-sort'}
             flex={'auto'}
             style={{
               marginLeft: '50px',
             }}
        >
          <span style={{marginRight: '10px'}}>Sort by:</span>
          <Select
            placeholder="Sort by"
            size='middle'
            style={{width: '200px'}}
            options={sortOptions}
            value={selectedSortOption}
            onChange={value => {
              setSelectedSortOption(value)
            }}
          />
        </Col>
      </Row>
    </div>
  )
  const ProductList = (
    <div className={'category-product-list'}
         style={{
           margin: '10px',
           padding: '10px',
           background: 'rgba(0, 0, 0, 0.04)',
         }}
    >
      <Row
        gutter={[50, 50]}
      >
        {
          pagination.list.map((sku, index) => {
            let {skuImages, name, price, saleCount, primeDiscount, giftCardBonus, rating, stock} = sku.sku
            // to 2 decimal places
            price = Math.round(price * 100) / 100
            const curPrice = Math.round(price * (1 - primeDiscount / 100) * 100) / 100
            rating = Math.round(rating * 10) / 10
            return (
              <Col
                key={index}
                // flex={'1 0 300px'}
                xs={{span: 12}}
                sm={{span: 12}}
                md={{span: 8}}
                lg={{span: 8}}
                xl={{span: 6}}
                xxl={{span: 6}}
              >
                <Card
                  onClick={(e) => {
                    e.stopPropagation()
                    onSkuClick(sku?.sku)
                  }}
                  hoverable
                  cover={
                    <div
                      style={{
                        paddingTop: '30px',
                      }}
                    >
                      <MyImage.FitSize url={skuImages?.[0].img}/>
                    </div>
                  }
                >
                  <Meta
                    title={name}
                    // title={'asdfasdfasdfsfsd sadfasasdasdasdasdasddf asdasdasd asdasd'}
                    // description={'asdfasdfasdfsfsd sadfasasdasdasdasdasddf asdasdasd asdasd'}
                    description={
                      <div className="price">
                        {
                          primeDiscount && primeDiscount > 0
                            ? <>
                              <span className="original-price">${price}</span>
                              <span className="discounted-price">
                            ${curPrice}
                          </span>
                            </>
                            : <span className="discounted-price">${price}</span>
                        }
                        {
                          // giftCardBonus && <div className="gift-bonus">
                          //   <span className="bonus-label"><GiftOutlined/>Gift Card Bonus:</span>
                          //   <span className="bonus-value">${giftCardBonus}</span>
                          // </div>
                        }
                      </div>
                    }
                    // 这里description过长会导致span失效，内容超出屏幕需要横向scroll，不知道为什么
                    //
                    // description="1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111"
                  />
                </Card>
              </Col>
            )
          })
        }
      </Row>
      <Row
        justify={'center'}
      >
        <Col>
          <Pagination
            showSizeChanger
            pageSizeOptions={['24', '36', '72', '108']}
            {...pagination}
          />
        </Col>
      </Row>
    </div>
  )
  console.log('screen.width', screen.width)
  console.log('window.innerWidth', innerWidth)
  const FilterSider = useMemo(() => {
    return <Layout
      hasSider={true}
    >
      <Layout.Sider
        className={'.my-menu-sider'}
        width={'220px'}
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={(broken) => {
          console.log(broken);
        }}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
        }}
        theme={'light'}
      >
        <Menu
          forceSubMenuRender={true}
          className={'category-side-filter'}
          mode="inline"
          items={menuProps.items}
          defaultOpenKeys={menuProps.defaultOpenKeys}
          selectable={false}
        />
      </Layout.Sider>
    </Layout>
  }, [menuProps])

  return (
    <Row
      className={'ant-row-no-newline third-level-category-product-list'}
      style={{}}
    >
      <Col id={'side-filter'}>
        {
          menuProps?.items?.length > 0
          && FilterSider
        }
      </Col>
      <Col id={'right-content'}
           flex={'auto'}
           style={{
             maxWidth: screen.width * 0.7
           }}
      >
        {HeadFilter}
        {ProductList}
      </Col>
      {/*<Col span={2}/>*/}
    </Row>
  );
}

export default ThirdLevelCategory;
