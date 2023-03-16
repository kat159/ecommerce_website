import Footer from '@/components/Footer';
import RightContent from '@/components/RightContent';
import {LinkOutlined} from '@ant-design/icons';
import type {Settings as LayoutSettings} from '@ant-design/pro-components';
import {SettingDrawer} from '@ant-design/pro-components';
import type {RunTimeLayoutConfig} from '@umijs/max';
import {history, Link} from '@umijs/max';
import defaultSettings from '../config/defaultSettings';
import {errorConfig} from './requestErrorConfig';
import {currentUser as queryCurrentUser} from './services/ant-design-pro/api';
import React, {useEffect} from 'react';
import {message} from 'antd';
const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';
import Keycloak from 'keycloak-js'
import {RequestConfig} from '@umijs/max';
import {getAuth, signInWithCustomToken} from "firebase/auth";
import axios from 'axios';
import dbmsMember from "@/services/dbms-member";
import globalRoutes from '../config/routes'
const memberService = dbmsMember.memberController
// ==================Initialize Firebase====================
import {initializeApp} from "firebase/app";
import {getAnalytics} from "firebase/analytics";
import {firebaseConfig} from '../config/cloudStorage';

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);



// TODO: 一个用户token统一为一个
const getToken = async () => {
  const res = await axios({
    method: 'post',
    url: 'http://localhost:88/api/security/token/firebase',
    data: {
      "username": "test",
    }
  })
  return res.data.data;
}
// TODO: 如果用户登录超过1小时， 重新获取token
const auth = getAuth(app);

setTimeout(() => {
  getToken().then(token => {
    signInWithCustomToken(auth, token)
      .then((userCredential) => {
        // Signed in

        const user = userCredential.user;
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ...
      });
  })
  // 1小时后重新获取token
}, 60 * 60 * 1000)

// ======================================

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
  loading?: boolean;
  keycloak?: Keycloak.KeycloakInstance;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
}> {
  let initOptions = {
    url: 'http://localhost:8080/',
    realm: 'my-projects',
    clientId: 'ecommerce-front',
    // onLoad: 'login-required'
  }
  let keycloak = new Keycloak(initOptions);
  // @ts-ignore
  // @ts-ignore
  const auth = await keycloak.init({
      onLoad: 'login-required' // will cause the page refreshed two times when hard refresh, can be solved by using 'check-sso', but only works for modern browsers
      // onLoad: 'check-sso', // **NOTE: only works for modern browsers
      // silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html'
    }
  )
  console.log('auth', auth)
  if (!auth) {
    keycloak.login()
  }
  console.info("Authenticated");
  localStorage.setItem("bearer-token", keycloak.token);
  localStorage.setItem("refresh-token", keycloak.refreshToken);
  console.log('keycloak', keycloak)
  console.log('subject', keycloak.subject)
  console.log('token', keycloak.token)
  console.log('tokenParsed', keycloak.tokenParsed)
  console.log('username', keycloak.tokenParsed.preferred_username)
  console.log('roles', keycloak.tokenParsed.realm_access.roles)
  console.log('is admin', keycloak.hasRealmRole('admin'), keycloak.tokenParsed.realm_access.roles.includes('admin'))
  console.log('is customer', keycloak.hasRealmRole('customer'), keycloak.tokenParsed.realm_access.roles.includes('customer'))
  console.log('token time', keycloak.tokenParsed.exp)
  setTimeout(() => {
    keycloak.updateToken(70).then((refreshed) => {
      if (refreshed) {
        console.debug('Token refreshed' + refreshed);
      } else {
        console.warn('Token not refreshed, valid for '
          + Math.round(keycloak.tokenParsed.exp + keycloak.timeSkew - new Date().getTime() / 1000) + ' seconds');
      }
    }).catch(() => {
      console.error('Failed to refresh token');
    });
  }, 60 * 60 * 1000)
  // get info of current user
  const userInfo = await memberService.login({}, {username: keycloak.tokenParsed.preferred_username,})
  const currentUser = userInfo.data
  if (!currentUser?.username) {
    console.error('Internal server error, new user not automatically created')
  }
  if (currentUser)
    currentUser.name = currentUser.name ?? currentUser.username
  console.log('currentUser', currentUser)
  return {
    currentUser: currentUser,
    keycloak: keycloak,
    settings: defaultSettings as Partial<LayoutSettings>,
  }
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({initialState, setInitialState}) => {
  const curPath = history.location.pathname;
  const isHome = curPath === '/' || curPath === '/home';
  console.log('curPath', curPath, 'isHome', isHome)
  return {
    rightContentRender: () => <RightContent/>,
    // title: 'Admin',
    // logo: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNjc3NjY3MTQxOTc3IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjIyMzM3IiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiPjxwYXRoIGQ9Ik0yODAgNzUyaDgwYzQuNCAwIDgtMy42IDgtOFYyODBjMC00LjQtMy42LTgtOC04aC04MGMtNC40IDAtOCAzLjYtOCA4djQ2NGMwIDQuNCAzLjYgOCA4IDh6TTQ3MiA0NzJoODBjNC40IDAgOC0zLjYgOC04VjI4MGMwLTQuNC0zLjYtOC04LThoLTgwYy00LjQgMC04IDMuNi04IDh2MTg0YzAgNC40IDMuNiA4IDggOHpNNjY0IDU0NGg4MGM0LjQgMCA4LTMuNiA4LThWMjgwYzAtNC40LTMuNi04LTgtOGgtODBjLTQuNCAwLTggMy42LTggOHYyNTZjMCA0LjQgMy42IDggOCA4eiIgcC1pZD0iMjIzMzgiPjwvcGF0aD48cGF0aCBkPSJNODgwIDExMkgxNDRjLTE3LjcgMC0zMiAxNC4zLTMyIDMydjczNmMwIDE3LjcgMTQuMyAzMiAzMiAzMmg3MzZjMTcuNyAwIDMyLTE0LjMgMzItMzJWMTQ0YzAtMTcuNy0xNC4zLTMyLTMyLTMyeiBtLTQwIDcyOEgxODRWMTg0aDY1NnY2NTZ6IiBwLWlkPSIyMjMzOSI+PC9wYXRoPjwvc3ZnPg==',
    waterMarkProps: {
      content: initialState?.currentUser?.name,
    },
    footerRender: () => <Footer/>,
    onMenuHeaderClick: () => history.push(isHome ? '/' : '/ecommerce/admin'),
    // logo可以是组件
    logo: isHome ? 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNjc3NjcxMTA4Njg5IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjE0Mjc2IiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiPjxwYXRoIGQ9Ik0xNzAuNjY3MDA4IDcxMy4zNzk4NHYxOTYuODQyNDk2aDY4Mi42NjU5ODR2LTE5Ni44NDM1Mkw2NjkuNzg4MTYgNjI1Ljc3ODY4OEgzNTQuMjExODRMMTcwLjY2NzAwOCA3MTMuMzc5ODR6IG0tMjQuNTA0MzItNTEuMzQxMzEybDE4My41NDY4OC04Ny42MDIxNzZhNTYuODg5MzQ0IDU2Ljg4OTM0NCAwIDAgMSAyNC41MDQzMi01LjU0NzAwOGgzMTUuNTczMjQ4YzguNDc4NzIgMCAxNi44NTA5NDQgMS44OTQ0IDI0LjUwNDMyIDUuNTQ3MDA4bDE4My41NDU4NTYgODcuNjAyMTc2YTU2Ljg4OTM0NCA1Ni44ODkzNDQgMCAwIDEgMzIuMzg1MDI0IDUxLjM0MTMxMnYxOTYuODQyNDk2YzAgMzEuNDE4MzY4LTI1LjQ2OTk1MiA1Ni44ODgzMi01Ni44ODkzNDQgNTYuODg4MzJIMTcwLjY2NzAwOGMtMzEuNDE5MzkyIDAtNTYuODg5MzQ0LTI1LjQ2OTk1Mi01Ni44ODkzNDQtNTYuODg4MzJ2LTE5Ni44NDM1MmE1Ni44ODkzNDQgNTYuODg5MzQ0IDAgMCAxIDMyLjM4NTAyNC01MS4zNDAyODh6TTUxMiA0NTUuMTEwNjU2Yzk0LjI1NjEyOCAwIDE3MC42NjcwMDgtNzYuNDA5ODU2IDE3MC42NjcwMDgtMTcwLjY2NTk4NCAwLTk0LjI1NzE1Mi03Ni40MTA4OC0xNzAuNjY3MDA4LTE3MC42NjcwMDgtMTcwLjY2NzAwOHMtMTcwLjY2NzAwOCA3Ni40MTA4OC0xNzAuNjY3MDA4IDE3MC42NjcwMDhTNDE3Ljc0Mzg3MiA0NTUuMTEwNjU2IDUxMiA0NTUuMTEwNjU2ek01MTIgNTEyYy0xMjUuNjc1NTIgMC0yMjcuNTU1MzI4LTEwMS44Nzk4MDgtMjI3LjU1NTMyOC0yMjcuNTU1MzI4UzM4Ni4zMjQ0OCA1Ni44ODkzNDQgNTEyIDU2Ljg4OTM0NHMyMjcuNTU1MzI4IDEwMS44Nzk4MDggMjI3LjU1NTMyOCAyMjcuNTU1MzI4UzYzNy42NzU1MiA1MTIgNTEyIDUxMnogbTg1LjMzMjk5MiAyMjcuNTU1MzI4aDExMy43Nzc2NjRjMTUuNzEwMjA4IDAgMjguNDQ0NjcyIDEyLjczNTQ4OCAyOC40NDQ2NzIgMjguNDQ0Njcycy0xMi43MzQ0NjQgMjguNDQ0NjcyLTI4LjQ0NDY3MiAyOC40NDQ2NzJoLTExMy43NzY2NGMtMTUuNzEwMjA4IDAtMjguNDQ0NjcyLTEyLjczNTQ4OC0yOC40NDQ2NzItMjguNDQ0NjcyczEyLjczNDQ2NC0yOC40NDQ2NzIgMjguNDQzNjQ4LTI4LjQ0NDY3MnoiIGZpbGw9IiMzMjMyMzMiIHAtaWQ9IjE0Mjc3Ij48L3BhdGg+PC9zdmc+'
      : 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNjc3NjY3MTQxOTc3IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjIyMzM3IiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiPjxwYXRoIGQ9Ik0yODAgNzUyaDgwYzQuNCAwIDgtMy42IDgtOFYyODBjMC00LjQtMy42LTgtOC04aC04MGMtNC40IDAtOCAzLjYtOCA4djQ2NGMwIDQuNCAzLjYgOCA4IDh6TTQ3MiA0NzJoODBjNC40IDAgOC0zLjYgOC04VjI4MGMwLTQuNC0zLjYtOC04LThoLTgwYy00LjQgMC04IDMuNi04IDh2MTg0YzAgNC40IDMuNiA4IDggOHpNNjY0IDU0NGg4MGM0LjQgMCA4LTMuNiA4LThWMjgwYzAtNC40LTMuNi04LTgtOGgtODBjLTQuNCAwLTggMy42LTggOHYyNTZjMCA0LjQgMy42IDggOCA4eiIgcC1pZD0iMjIzMzgiPjwvcGF0aD48cGF0aCBkPSJNODgwIDExMkgxNDRjLTE3LjcgMC0zMiAxNC4zLTMyIDMydjczNmMwIDE3LjcgMTQuMyAzMiAzMiAzMmg3MzZjMTcuNyAwIDMyLTE0LjMgMzItMzJWMTQ0YzAtMTcuNy0xNC4zLTMyLTMyLTMyeiBtLTQwIDcyOEgxODRWMTg0aDY1NnY2NTZ6IiBwLWlkPSIyMjMzOSI+PC9wYXRoPjwvc3ZnPg==',
    title: isHome ? 'My Projects' : 'Ecommerce Admin',
    onPageChange: () => {
      const {location} = history;
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        // history.push(loginPath);
        initialState?.keycloak?.login({
          redirectUri: window.location.href,
        })
      }
    },
    /*
    layoutBgImgList: [
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/D2LWSqNny4sAAAAAAAAAAAAAFl94AQBr',
        left: 85,
        bottom: 100,
        height: '303px',
      },
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/C2TWRpJpiC0AAAAAAAAAAAAAFl94AQBr',
        bottom: -68,
        right: -45,
        height: '303px',
      },
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/F6vSTbj8KpYAAAAAAAAAAAAAFl94AQBr',
        bottom: 0,
        left: 0,
        width: '331px',
      },
    ],
    */
    links: isDev
      ? [
        <Link key="openapi" to="/umi/plugin/openapi" target="_blank">
          <LinkOutlined/>
          <span>OpenAPI 文档</span>
        </Link>,
      ]
      : [],
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    childrenRender: (children) => {
      // if (initialState?.loading) return <PageLoading />;
      return (
        <>
          {children}
          <SettingDrawer
            disableUrlParams
            enableDarkTheme
            settings={initialState?.settings}
            onSettingChange={(settings) => {
              setInitialState((preInitialState) => ({
                ...preInitialState,
                settings,
              }));
            }}
          />
        </>
      );
    },
    ...initialState?.settings,
  };
};

/**
 * @name request 配置，可以配置错误处理
 * 它基于 axios 和 ahooks 的 useRequest 提供了一套统一的网络请求和错误处理方案。
 * @doc https://umijs.org/docs/max/request#配置
 */
export const request: RequestConfig = {
  ...errorConfig,

  // 新增自定义配置
  baseURL: 'http://localhost:88/api',

};
