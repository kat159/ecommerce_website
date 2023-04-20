/* eslint-disable react/jsx-no-undef */
import {AppstoreOutlined, MailOutlined, SettingOutlined} from '@ant-design/icons';
import {Layout, Menu, Typography} from 'antd';
import {useModel, history} from "umi";
import React from "react";

const Home = () => {
  const {categoryForest, categoryIdMap} = useModel('ECommerceFront.category');
  const getItems = (categoryForest) => {
    return categoryForest.map((category) => {
      return {
        key: category.id,
        label: (
          <span
            // onClick={(e) => {
            //   // e.stopPropagation()

            //   onClickCategory({category})
            // }}
          >
              <Typography.Text>
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
  const items = getItems(categoryForest);
  const onClickCategory = ({category}) => {
    const categoryPath = []
    let curCategory = category;
    while (curCategory && curCategory.id !== 0) {
      categoryPath.push(curCategory.id)
      curCategory = categoryIdMap[curCategory.parentId]
    }

    history.push(`${window.location.pathname}/category?category=${categoryPath.reverse().join(',')}`);
  };
  return (
    <Layout>
      <Layout.Sider
        className={'.my-menu-sider'}
        theme={"light"}
        width={'250px'}
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={(broken) => {

        }}
        onCollapse={(collapsed, type) => {

        }}
      >
        <Menu
          // onClick={onClick}
          style={{
            // width: 'fit-content',
            // background: 'none',
          }}
          mode="vertical"
          items={items}
          // selectable={false}
        />
      </Layout.Sider>
    </Layout>
  );
}

export default Home;
