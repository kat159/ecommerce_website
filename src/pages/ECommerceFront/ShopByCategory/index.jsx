import React from 'react';
import {useLocation, useModel, history} from 'umi';
import {Breadcrumb} from "antd";
import {HomeOutlined} from "@ant-design/icons";
import ThirdLevelCategory from "@/pages/ECommerceFront/ShopByCategory/ThirdLevelCategory";
import SecondLevelCategory from "@/pages/ECommerceFront/ShopByCategory/SecondLevelCategory";
import FirstLevelCategory from "@/pages/ECommerceFront/ShopByCategory/FirstLevelCategory";
import Product from "@/pages/ECommerceFront/ShopByCategory/Product";
import NoCategory from "@/pages/ECommerceFront/ShopByCategory/NoCategory";

function Index(props) {
  const location = useLocation();
  const {categoryIdMap} = useModel('ECommerceFront.category');
  const {pathname, search, hash} = location;
  const searchParams = new URLSearchParams(search);
  for (let [key, value] of searchParams) {

  }
  const categoryIds = searchParams.get('category')?.split(',') ?? []
  const skuId = searchParams.get('sku') ?? null;
  console.log('skuId', skuId)
  return (
    <div>
      <Breadcrumb
        style={{
          margin: '16px',
        }}
        className={'shop-list-breadcrumb'}
      >
        <Breadcrumb.Item
          onClick={() => {
            history.push('/ecommerce/front/category')
          }}
          className={'my-click-icon'}
        >
          <HomeOutlined/>
        </Breadcrumb.Item>
        {
          categoryIds.map((categoryId, index) => {
            const category = categoryIdMap[categoryId];
            return (
              <Breadcrumb.Item
                key={index}
                onClick={() => {
                  const curSearchParams = window.location.search;
                  const newSearchParams = `?category=${categoryIds.slice(0, index + 1).join(',')}`
                  if (curSearchParams !== newSearchParams) {
                    history.push(`${window.location.pathname}?category=${categoryIds.slice(0, index + 1).join(',')}`);
                  }
                }}
                className={'my-click-icon'}
              >
                {category.name}
              </Breadcrumb.Item>
            )
          })
        }
      </Breadcrumb>
      {
        // ERROR NOTE: ?????????????????????????????????????????????hooks????????????????????????hooks, ??????????????????, hooks???????????? ?????????????????????????????????if????????????????????????hooks???????????????
        //   important: better not call component in this way, if have to, only call component in function way if you are sure that the component will be called in every render
        // categoryIds.length === 3 ? ThirdLevelCategory({categoryIds})
        skuId ? <Product skuId={skuId}/>
          : categoryIds.length === 3 ? <ThirdLevelCategory categoryIds={categoryIds}/>
            : categoryIds.length === 2 ? <SecondLevelCategory curCategory={categoryIdMap[categoryIds[1]]}/>
              : categoryIds.length === 1 ? <FirstLevelCategory curCategory={categoryIdMap[categoryIds[0]]}/>
                : !categoryIds || categoryIds.length === 0 ? <NoCategory/>
                  : <div> ERROR </div>
      }
    </div>
  );
}

export default Index;
