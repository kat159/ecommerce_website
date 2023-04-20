export const ecommerceFrontRoutes = {
  path: '/ecommerce/front',
  component: '../layouts/ECommerceFrontLayout',
  layout: false,
  routes: [
    {
      path: '',
      redirect: 'category',
      // component: './ECommerceFront/Home.jsx',
    },
    {
      path: 'category',
      component: './ECommerceFront/ShopByCategory/index.jsx',
    }
  ],
}
export const ecommerceAdminRoutes = {
  path: '/ecommerce/admin',
  component: '../layouts/ECommerceAdminLayout',
  // component: '../layouts/ProLayout',
  layout: false,
  routes: [
    {
      path: 'user',
      layout: false,
      routes: [
        {
          name: 'login',
          path: 'login',
          component: './User/Login',
        },
      ],
    },
    {
      path: 'welcome',
      name: 'welcome',
      icon: 'smile',
      component: './Welcome',
    },
    {
      path: 'admin',
      name: 'admin',
      icon: 'crown',
      access: 'canAdmin',
      routes: [
        {
          path: '',
          redirect: 'sub-page',
        },
        {
          path: 'sub-page',
          name: 'sub-page',
          component: './Admin',
        },
      ],
    },
    {
      name: 'list.table-list',
      icon: 'table',
      path: 'list',
      component: './TableList',
    },
    {
      name: 'pms',
      path: 'ecommerce',
      routes: [
        {
          name: 'category',
          path: 'category',
          component: './ProductManagement2/Category.jsx',
        },
        {
          name: 'brand',
          path: 'brand',
          component: './ProductManagement2/Brand.jsx',
        },
        {
          name: 'product',
          path: 'product',
          // component: './ProductManagement2/Product.jsx',
          routes: [
            {
              name: 'publish',
              path: 'publish',
              component: './ProductManagement2/Product/Publish.jsx',
            },
            {
              name: 'manage',
              path: 'manage',
              component: './ProductManagement2/Product/Manage2.jsx',
            }
          ]
        },
        {
          name: 'demo',
          path: 'demo',
          component: './ProductManagement/Demo.jsx',
        },
      ]
    },
    {
      path: '',
      redirect: 'welcome',
    },
  ],
}
export const MyProjectsRoutes = []
export const ecommerceFrontRoutesArr = [
  {
    path: '',
    redirect: 'category',
    // component: './ECommerceFront/Home.jsx',
  },
  {
    path: 'category',
    component: './ECommerceFront/ShopByCategory/index.jsx',
  },
  {
    path: 'account',
    component: './ECommerceFront/UserAccount/Account.jsx',
  },
  {
    path: 'account',
    // component: './ECommerceFront/UserAccount/Account.jsx',
    component: '../layouts/ECommerceFrontAccountLayout',
    routes: [
      // {
      //   path: 'browse-history',
      //   component: './ECommerceFront/UserAccount/BrowsingHistory.jsx',
      // },
      {
        path: 'order',
        component: './ECommerceFront/UserAccount/Orders.jsx',
      },
      {
        path: 'switch-account',
        component: './ECommerceFront/UserAccount/SwitchAccount.jsx',
      },
      {
        path: 'profile',
        component: './ECommerceFront/UserAccount/Profile.jsx',
      },
      {
        path: 'address',
        component: './ECommerceFront/UserAccount/Address.jsx',
      },
    ]
  },
  {
    path: 'cart',
    component: './ECommerceFront/Cart/Cart.jsx',
  },
  {
    path: '/ecommerce/front/check-out',
    component: './ECommerceFront/CheckOut/CheckOut.jsx',
  },

]
export const ecommerceAdminRoutesArr = [
  // {
  //   path: 'user',
  //   layout: false,
  //   routes: [
  //     {
  //       name: 'login',
  //       path: 'login',
  //       component: './User/Login',
  //     },
  //   ],
  // },
  // {
  //   path: 'welcome',
  //   name: 'welcome',
  //   icon: 'smile',
  //   component: './Welcome',
  // },
  // {
  //   path: 'admin',
  //   name: 'admin',
  //   icon: 'crown',
  //   access: 'canAdmin',
  //   routes: [
  //     {
  //       path: '',
  //       redirect: 'sub-page',
  //     },
  //     {
  //       path: 'sub-page',
  //       name: 'sub-page',
  //       component: './Admin',
  //     },
  //   ],
  // },
  // {
  //   name: 'list.table-list',
  //   icon: 'table',
  //   path: 'list',
  //   component: './TableList',
  // },
  {
    name: 'pms',
    path: 'product-manage',
    flatMenu: true,
    routes: [
      {
        name: 'category',
        path: 'category',
        component: './ProductManagement2/Category.jsx',
        // component: './ProductManagement2/Category2.jsx',
        // component: './ProductManagement2/Category3/Category3.jsx',
      },
      {
        name: 'brand',
        path: 'brand',
        component: './ProductManagement2/Brand.jsx',
      },
      {
        name: 'product',
        path: 'product',
        // component: './ProductManagement2/Product.jsx',
        routes: [
          {
            name: 'publish',
            path: 'publish',
            component: './ProductManagement2/Product/Publish.jsx',
          },
          {
            name: 'manage',
            path: 'manage',
            component: './ProductManagement2/Product/Manage2.jsx',
          }
        ]
      },
      {
        name: 'order',
        path: 'order',
        component: './ProductManagement2/Order.jsx',
      },
      {
        name: 'purchase',
        path: 'purchase',
        component: './ProductManagement2/Purchase.jsx',
      },
      // {
      //   name: 'demo',
      //   path: 'demo',
      //   component: './ProductManagement/Demo.jsx',
      // },
    ]
  },
  {
    path: '',
    redirect: 'product-manage',
  },
]
export const backtestRoutesArr = [
  {
    name: 'Market',
    path: 'market',
    component: './Backtest/Market.jsx',
  },
  {
    name: 'Criterion',
    path: 'criterion',
    component: './Backtest/Criterion/Criterion.jsx',
  },
  {
    path: '',
    redirect: 'market',
  },
  {
    path: '*',
    redirect: '/backtest/market',
  }
  // {
  //   name: 'market',
  //   path: 'market',
  //   component: './User/Login',
  // }
]
