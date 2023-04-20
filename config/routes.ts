/**
 * @name umi 的路由配置
 * @description 只支持 path,component,routes,redirect,wrappers,name,icon 的配置
 * @param path  path 只支持两种占位符配置，第一种是动态参数 :id 的形式，第二种是 * 通配符，通配符只能出现路由字符串的最后。
 * @param component 配置 location 和 path 匹配后用于渲染的 React 组件路径。可以是绝对路径，也可以是相对路径，如果是相对路径，会从 src/pages 开始找起。
 * @param routes 配置子路由，通常在需要为多个路径增加 layout 组件时使用。
 * @param redirect 配置路由跳转
 * @param wrappers 配置路由组件的包装组件，通过包装组件可以为当前的路由组件组合进更多的功能。 比如，可以用于路由级别的权限校验
 * @param name 配置路由的标题，默认读取国际化文件 menu.ts 中 menu.xxxx 的值，如配置 name 为 login，则读取 menu.ts 中 menu.login 的取值作为标题
 * @param icon 配置路由的图标，取值参考 https://ant.design/components/icon-cn， 注意去除风格后缀和大小写，如想要配置图标为 <StepBackwardOutlined /> 则取值应为 stepBackward 或 StepBackward，如想要配置图标为 <UserOutlined /> 则取值应为 user 或者 User
 * @doc https://umijs.org/docs/guides/routes
 */
// export default [
//   {
//     path: '/ecommerce/front',
//     component: '../layouts/ECommerceFrontLayout',
//     layout: false,
//     routes: [
//       {
//         path: '',
//         redirect: 'category',
//         // component: './ECommerceFront/Home.jsx',
//       },
//       {
//         path: 'category',
//         component: './ECommerceFront/ShopByCategory/index.jsx',
//       }
//     ]
//   },
//   {
//     path: '/user',
//     layout: false,
//     routes: [
//       {
//         name: 'login',
//         path: '/user/login',
//         component: './User/Login',
//       },
//     ],
//   },
//   {
//     path: '/welcome',
//     name: 'welcome',
//     icon: 'smile',
//     component: './Welcome',
//   },
//   {
//     path: '/admin',
//     name: 'admin',
//     icon: 'crown',
//     access: 'canAdmin',
//     routes: [
//       {
//         path: '/admin',
//         redirect: '/admin/sub-page',
//       },
//       {
//         path: '/admin/sub-page',
//         name: 'sub-page',
//         component: './Admin',
//       },
//     ],
//   },
//   {
//     name: 'list.table-list',
//     icon: 'table',
//     path: '/list',
//     component: './TableList',
//   },
//   {
//     name: 'pms',
//     path: '/ecommerce',
//     routes: [
//       {
//         name: 'category',
//         path: 'category',
//         component: './ProductManagement2/Category.jsx',
//       },
//       {
//         name: 'brand',
//         path: 'brand',
//         component: './ProductManagement2/Brand.jsx',
//       },
//       {
//         name: 'product',
//         path: 'product',
//         // component: './ProductManagement2/Product.jsx',
//         routes: [
//           {
//             name: 'publish',
//             path: 'publish',
//             component: './ProductManagement2/Product/Publish.jsx',
//           },
//           {
//             name: 'manage',
//             path: 'manage',
//             component: './ProductManagement2/Product/Manage2.jsx',
//           }
//         ]
//       },
//       // {
//       //   name: 'test',
//       //   path: 'test',
//       //   component: './ProductManagement/Test.jsx',
//       // },
//       // {
//       //   name: 'test2',
//       //   path: 'test2',
//       //   component: './ProductManagement/Test2.jsx',
//       // },
//       {
//         name: 'demo',
//         path: 'demo',
//         component: './ProductManagement/Demo.jsx',
//       },
//     ]
//   },
//   {
//     path: '/',
//     redirect: '/welcome',
//   },
//   {
//     path: '*',
//     layout: false,
//     component: './404',
//   },
// ];

import {ecommerceAdminRoutes, ecommerceFrontRoutes} from './childrenRoutes'
import {ecommerceAdminRoutesArr, ecommerceFrontRoutesArr, backtestRoutesArr} from "./childrenRoutes";

export default [
  {
    path: '/',
    // layout: false,
    myLogo: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNjc3NjcxMTA4Njg5IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjE0Mjc2IiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiPjxwYXRoIGQ9Ik0xNzAuNjY3MDA4IDcxMy4zNzk4NHYxOTYuODQyNDk2aDY4Mi42NjU5ODR2LTE5Ni44NDM1Mkw2NjkuNzg4MTYgNjI1Ljc3ODY4OEgzNTQuMjExODRMMTcwLjY2NzAwOCA3MTMuMzc5ODR6IG0tMjQuNTA0MzItNTEuMzQxMzEybDE4My41NDY4OC04Ny42MDIxNzZhNTYuODg5MzQ0IDU2Ljg4OTM0NCAwIDAgMSAyNC41MDQzMi01LjU0NzAwOGgzMTUuNTczMjQ4YzguNDc4NzIgMCAxNi44NTA5NDQgMS44OTQ0IDI0LjUwNDMyIDUuNTQ3MDA4bDE4My41NDU4NTYgODcuNjAyMTc2YTU2Ljg4OTM0NCA1Ni44ODkzNDQgMCAwIDEgMzIuMzg1MDI0IDUxLjM0MTMxMnYxOTYuODQyNDk2YzAgMzEuNDE4MzY4LTI1LjQ2OTk1MiA1Ni44ODgzMi01Ni44ODkzNDQgNTYuODg4MzJIMTcwLjY2NzAwOGMtMzEuNDE5MzkyIDAtNTYuODg5MzQ0LTI1LjQ2OTk1Mi01Ni44ODkzNDQtNTYuODg4MzJ2LTE5Ni44NDM1MmE1Ni44ODkzNDQgNTYuODg5MzQ0IDAgMCAxIDMyLjM4NTAyNC01MS4zNDAyODh6TTUxMiA0NTUuMTEwNjU2Yzk0LjI1NjEyOCAwIDE3MC42NjcwMDgtNzYuNDA5ODU2IDE3MC42NjcwMDgtMTcwLjY2NTk4NCAwLTk0LjI1NzE1Mi03Ni40MTA4OC0xNzAuNjY3MDA4LTE3MC42NjcwMDgtMTcwLjY2NzAwOHMtMTcwLjY2NzAwOCA3Ni40MTA4OC0xNzAuNjY3MDA4IDE3MC42NjcwMDhTNDE3Ljc0Mzg3MiA0NTUuMTEwNjU2IDUxMiA0NTUuMTEwNjU2ek01MTIgNTEyYy0xMjUuNjc1NTIgMC0yMjcuNTU1MzI4LTEwMS44Nzk4MDgtMjI3LjU1NTMyOC0yMjcuNTU1MzI4UzM4Ni4zMjQ0OCA1Ni44ODkzNDQgNTEyIDU2Ljg4OTM0NHMyMjcuNTU1MzI4IDEwMS44Nzk4MDggMjI3LjU1NTMyOCAyMjcuNTU1MzI4UzYzNy42NzU1MiA1MTIgNTEyIDUxMnogbTg1LjMzMjk5MiAyMjcuNTU1MzI4aDExMy43Nzc2NjRjMTUuNzEwMjA4IDAgMjguNDQ0NjcyIDEyLjczNTQ4OCAyOC40NDQ2NzIgMjguNDQ0Njcycy0xMi43MzQ0NjQgMjguNDQ0NjcyLTI4LjQ0NDY3MiAyOC40NDQ2NzJoLTExMy43NzY2NGMtMTUuNzEwMjA4IDAtMjguNDQ0NjcyLTEyLjczNTQ4OC0yOC40NDQ2NzItMjguNDQ0NjcyczEyLjczNDQ2NC0yOC40NDQ2NzIgMjguNDQzNjQ4LTI4LjQ0NDY3MnoiIGZpbGw9IiMzMjMyMzMiIHAtaWQ9IjE0Mjc3Ij48L3BhdGg+PC9zdmc+',
    myTitle: 'My Projects',
    // component: '../layouts/MyProjectsLayout',
    menuRender: false,
    routes: [
      {
        path: '',
        component: './MyProjectsHome/MyProjects',
      }
    ]
  },
  {
    path: '/ecommerce/admin',
    myLogo: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNjc3NjY3MTQxOTc3IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjIyMzM3IiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiPjxwYXRoIGQ9Ik0yODAgNzUyaDgwYzQuNCAwIDgtMy42IDgtOFYyODBjMC00LjQtMy42LTgtOC04aC04MGMtNC40IDAtOCAzLjYtOCA4djQ2NGMwIDQuNCAzLjYgOCA4IDh6TTQ3MiA0NzJoODBjNC40IDAgOC0zLjYgOC04VjI4MGMwLTQuNC0zLjYtOC04LThoLTgwYy00LjQgMC04IDMuNi04IDh2MTg0YzAgNC40IDMuNiA4IDggOHpNNjY0IDU0NGg4MGM0LjQgMCA4LTMuNiA4LThWMjgwYzAtNC40LTMuNi04LTgtOGgtODBjLTQuNCAwLTggMy42LTggOHYyNTZjMCA0LjQgMy42IDggOCA4eiIgcC1pZD0iMjIzMzgiPjwvcGF0aD48cGF0aCBkPSJNODgwIDExMkgxNDRjLTE3LjcgMC0zMiAxNC4zLTMyIDMydjczNmMwIDE3LjcgMTQuMyAzMiAzMiAzMmg3MzZjMTcuNyAwIDMyLTE0LjMgMzItMzJWMTQ0YzAtMTcuNy0xNC4zLTMyLTMyLTMyeiBtLTQwIDcyOEgxODRWMTg0aDY1NnY2NTZ6IiBwLWlkPSIyMjMzOSI+PC9wYXRoPjwvc3ZnPg==',
    myTitle: 'Ecommerce Admin',
    // layout: false,
    flatMenu: true,
    // headerRender: false,
    // component: '../layouts/ECommerceAdminLayout/Layout.tsx',
    routes: ecommerceAdminRoutesArr
  },
  {
    path: '/ecommerce/front',
    component: '../layouts/ECommerceFrontLayout',
    layout: false,
    routes: ecommerceFrontRoutesArr
  },
  {
    layout: false,
    path: '/backtest',
    component: '../layouts/BacktestLayout',
    routes: backtestRoutesArr
  },
  {
    path: '*',
    layout: false,
    component: './404',
  },
];
